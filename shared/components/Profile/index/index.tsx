import { Typography } from "@shared/components/common/typography";
import React from "react";
import { useAppSelector } from "redux/store";
import { useRouter } from "next/router";
import clsx from "clsx";
import { Icons } from "@shared/const/Icons";
import { CopyOutlined, LoginOutlined, SelectOutlined } from "@ant-design/icons";
import { AddressText } from "@shared/components/common/specialFields/SpecialFields";
import { useToasts } from "react-toast-notifications";
import Styles from "./styles.module.scss";
import { Logo } from "@shared/components/Layouts";
import Link from "next/link";

const ProfileIndexPage = () => {
  const user = useAppSelector((state) => state.user);
  const router = useRouter();
  React.useEffect(() => {
    console.log(user);
  }, [user]);

  const { addToast } = useToasts();

  return (
    <>
      <div
        className={clsx(
          "flex flex-col justify-between border border-overlay-border p-4 rounded-t-md h-52 relative overflow-hidden"
        )}
      >
        <img
          src={Icons.harmony}
          className="absolute top-[-80px] right-[-80px]"
          alt=""
        />
        <div className="flex flex-row">
          <div className="flex flex-col">
            <h1 className="text-white" style={{ fontSize: "32px" }}>
              0 ONE
            </h1>
            <Typography type="title" className="text-primary ">
              0 USD
            </Typography>
          </div>
        </div>
      </div>
      <div className="flex justify-between border border-t-0 border-overlay-border p-4 rounded-b-md">
        <Typography type="subTitle" className="text-primary">
          Harmony Address: <AddressText text={user.address} />
        </Typography>
        <div className="flex items-center text-primary gap-4">
          <div
            onClick={() => {
              navigator.clipboard.writeText(user.address);
              addToast("Copied to clipboard", { appearance: "info" });
            }}
            className="cursor-pointer"
          >
            <CopyOutlined />
          </div>
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://explorer.harmony.one/address/${user.address}`}
          >
            <SelectOutlined />
          </a>
        </div>
      </div>
      <div className="flex flex-col w-full mt-10">
        <div className="flex justify-between w-full items-center">
          <Typography type="title" className="text-white">
            Activities
          </Typography>
          <Link href="/profile/activity">
            <a href="/profile/activity">
              <Typography type="span" className="text-primary cursor-pointer">
                View More
              </Typography>
            </a>
          </Link>
        </div>
        <hr className="w-full mt-4" />
        <div
          className={clsx(
            "w-full ",
            "flex flex-col",
            {
              [`${Styles.gray} justify-center items-center gap-6 h-72`]:
                !user.activity,
            },
            {
              ["py-10 gap-y-2"]: user.activity,
            }
          )}
        >
          {user.activity ? (
            user.activity.map(({ createdAt, type }, index) => {
              return <Activity date={createdAt} type={type} />;
            })
          ) : (
            <>
              <img src={Icons.logo} className="h-40 w-40" alt="" />
              <Typography
                type="subTitle"
                className={clsx(Styles.title, "text-primary")}
              >
                You don't have any activity yet
              </Typography>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export const Activity = ({ date, type }) => {
  return (
    <div className="flex sm:gap-4 gap-2 text-primary items-primary sm:px-10">
      <div className="flex flex-col items-center justify-center text-sm">
        <div>
          {new Date(date).getUTCHours()}:{new Date(date).getUTCMinutes()}
        </div>
        <div>
          {new Date(date).getMonth() + 1}-{new Date(date).getDate()}-
          {new Date(date).getFullYear()}
        </div>
      </div>
      <div className="bg-overlay-border p-4 rounded-full flex items-center">
        {type === "login" && (
          <div className="text-xl h-6 w-6 flex items-center justify-center">
            {" "}
            <LoginOutlined />
          </div>
        )}
        {type !== "login" && (
          <img className="h-6 w-6" src={Icons.logo} alt="" />
        )}
      </div>

      <div className="flex items-center justify-center">
        {type === "login" && "You loged in for first time"}
        {type === "buy" && "You bought an NFT"}
        {type === "sell" && "You sold an NFT"}
      </div>
    </div>
  );
};

export default ProfileIndexPage;