/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useAppDispatch, store } from "redux/store";
import { Button } from "shared/components/common/button";
import clsx from "clsx";
import useMagicLink from "@shared/hooks/useMagicLink";
import { WALLETS } from "@shared/utils/connection/utils";
import { LoadingOutlined } from "@ant-design/icons";
import { onGetAssets, onLogged } from "@redux/actions";
import { switchChain } from "@shared/web3";
import { useBlockchain } from "@shared/context/useBlockchain";
import { CHAIN_IDS_BY_NAME } from "@shared/utils/chains";
import { useUser } from "@shared/context/useUser";
import { useWeb3React } from "@web3-react/core";

const Login = () => {
  const [loading, setLoading] = React.useState(false);
  const [isLogged, setIsLogged] = React.useState(false);
  const { login, isAuthenticated } = useMagicLink(
    store.getState()["networks"].networkId,
  );

  const { account, provider } = useWeb3React();

  const { blockchain } = useBlockchain();

  const query: any = useSearchParams();
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { updateUser } = useUser();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(updateUser);
      localStorage.setItem("typeOfConnection", "magic");
      localStorage.setItem("loginTime", new Date().getTime().toString());
      const queryAddress: any = query.get("redirectAddress")?.toString();
      if (
        query.get("redirect") === "true" &&
        query.get("redirectAddress") != null
      ) {
        router.push(queryAddress !== undefined ? queryAddress : "/");
      }
      router.push("/");
    } catch (err) {
      console.log({ err });
      setLoading(false);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    if (isAuthenticated) router.push("/");
  }, [isAuthenticated]);

  const handleConnection = async (connection: any, title: any) => {
    setLoading(true);
    try {
      await connection.connector.activate();
      localStorage.setItem("typeOfConnection", title);
      localStorage.setItem("loginTime", new Date().getTime().toString());
      setIsLogged(true);
    } catch (err) {
      console.log({ err });
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (account && isLogged) {
      const queryAddress: any = query.get("redirectAddress")?.toString();
      setTimeout(async () => {
        try {
          await switchChain(CHAIN_IDS_BY_NAME[blockchain]);
        } catch (e) {
          console.log(e.message);
        }
        updateUser({
          ethAddress: account,
          email: "",
          provider: provider?.provider,
          providerName: "web3react",
        });
        dispatch(onGetAssets({ address: account, blockchain }));
        if (
          query.get("redirect") === "true" &&
          query.get("redirectAddress") != null
        ) {
          router.push(queryAddress !== undefined ? queryAddress : "/");
        } else {
          router.push("/");
        }
        setLoading(false);
      }, 1000);
    }
  }, [account, isLogged]);

  return (
    <div className="pt-16 min-h-[90vh]">
      <div className="overflow-hidden relative min-h-[80vh] w-full flex flex-col items-center justify-center gap-10">
        <div className="absolute h-full overflow-hidden w-full flex items-center justify-center top-0 bottom-0 right-0 left-0">
          <img
            src="/images/community.svg"
            className={`absolute  w-[120vw] min-w-[1920px] min-h-[100vh] opacity-25`}
            style={{ width: "150vw" }}
            alt=""
          />
        </div>
        <h1 className="font-bold text-white text-3xl relative text-center">
          JOIN THE <span className="text-red-primary font-bold">5</span>
          <span className="text-white font-bold">HEADGAMES</span> MARKETPLACE
        </h1>
        <div
          className={clsx(
            "flex flex-col gap-4 relative h-80 items-center justify-center",
          )}
        >
          {loading === true ? (
            <LoadingOutlined className="text-5xl text-white" />
          ) : (
            <>
              {WALLETS.map((k, i) => (
                <Button
                  disabled={loading}
                  decoration="line-white"
                  size="medium"
                  className="w-full mb-2 bg-overlay rounded-md  text-white hover:!text-overlay"
                  onClick={() => handleConnection(k.connection, k.title)}
                >
                  {loading ? "..." : "Login with " + k.title}
                </Button>
              ))}
              <Button
                disabled={loading}
                decoration="line-white"
                size="medium"
                className="w-full mb-2 bg-overlay rounded-md  text-white hover:!text-overlay"
                onClick={() => handleLogin()}
              >
                {loading ? "..." : "Login with Email"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
