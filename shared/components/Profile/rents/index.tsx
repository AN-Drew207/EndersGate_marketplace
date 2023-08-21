import { Button } from "@shared/components/common/button";
import { Typography } from "@shared/components/common/typography";
import { Icons } from "@shared/const/Icons";
import clsx from "clsx";
import React from "react";
import Web3 from "web3";
import Link from "next/link";

import { useAppDispatch, useAppSelector } from "redux/store";
import Styles from "./styles.module.scss";
import packs from "../../../packs.json";
import { getAddresses, getAddressesMatic, switchChain } from "@shared/web3";

import { useModal } from "@shared/hooks/modal";
import {
  onCancelSale,
  onLoadSales,
  onGetAssets,
  cancelRent,
} from "@redux/actions";
import { convertArrayCards } from "@shared/components/common/convertCards";
import { useWeb3React } from "@web3-react/core";
import { useBlockchain } from "@shared/context/useBlockchain";
import { formatPrice } from "@shared/utils/formatPrice";
import { toast } from "react-hot-toast";
import { LoadingOutlined } from "@ant-design/icons";
import { CHAIN_IDS_BY_NAME } from "@shared/components/chains";

const Rents = () => {
  const nfts = useAppSelector((state) => state.nfts);
  const { account: user, provider } = useWeb3React();

  const [cancel, setCancel] = React.useState({ id: -1, blockchain: "" });
  const { Modal, show, hide, isShow } = useModal();
  const dispatch = useAppDispatch();

  const [rents, setRents] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const { blockchain, updateBlockchain } = useBlockchain();

  const handleCancelRent = async () => {
    try {
      setIsLoading(true);
      const changed = await switchChain(CHAIN_IDS_BY_NAME[cancel.blockchain]);
      if (!changed) {
        throw new Error(
          "An error occurred while changing the network, please try again.",
        );
      }
      updateBlockchain(cancel.blockchain);
      const tx = await dispatch(
        cancelRent({
          tokenId: cancel.id,
          provider: provider.provider,
          user: user,
          blockchain: cancel.blockchain,
        }),
      );
      if ((tx as any).error) {
        throw Error(
          "An error has occurred while cancelling the sale, please try again",
        );
      }
      dispatch(onLoadSales());
      dispatch(onGetAssets({ address: user, blockchain }));
      toast.success("Your sale has been canceled successfully");
    } catch (err) {
      toast.error(err.message);
    }
    setIsLoading(false);

    hide();
  };

  React.useEffect(() => {
    const arrayPacks = [];
    nfts.allRents.forEach((sale, index) => {
      if (sale.seller.toLowerCase() === user.toLowerCase()) {
        arrayPacks.push(sale);
      }
    });
    setRents(arrayPacks);
  }, [nfts.allRents, user]);

  return (
    <div className="flex flex-col w-full min-h-screen gap-4 md:px-20 px-8">
      <div className="flex w-full items-center">
        <h1 className="text-white text-4xl font-bold text-center w-full">
          My Rent Listings
        </h1>
      </div>
      <Modal isShow={isShow} withoutX>
        <div className="flex flex-col gap-8 bg-overlay p-8 py-16 w-96 border border-overlay-border rounded-xl">
          <Typography
            type="subTitle"
            className="text-white text-center text-xl font-bold"
          >
            Do you want to cancel this listing?
          </Typography>
          {isLoading ? (
            <div className="flex justify-center items-center">
              {" "}
              <LoadingOutlined className="text-4xl text-white" />{" "}
            </div>
          ) : (
            <div className="flex justify-center items-center gap-4">
              <Button
                decoration="line-white"
                className="hover:text-overlay !font-bold text-white rounded-xl"
                size="small"
                onClick={() => {
                  hide();
                }}
              >
                Cancel
              </Button>
              <Button
                // decoration="fill"
                size="small"
                className="hover:text-red-primary !font-bold !hover:border-red-primary text-overlay bg-red-primary rounded-xl"
                onClick={() => {
                  handleCancelRent();
                }}
              >
                Confirm
              </Button>
            </div>
          )}
        </div>
      </Modal>
      <div
        className={clsx(
          "flex mb-10 items-center  justify-center",
          {
            [`${Styles.gray} flex-col items-center gap-6 h-full min-h-[400px]`]:
              rents.length == 0,
          },
          {
            ["gap-2 flex-wrap gap-2"]: rents.length != 0,
          },
        )}
      >
        {rents.length > 0 ? (
          <div className="w-full overflow-x-auto border border-overlay-border rounded-xl py-4">
            <table className="w-full min-w-max">
              <thead className="text-white font-bold">
                <th className="text-center px-8">NFT</th>
                <th className="text-center px-8">RENT ID</th>
                <th className="text-center px-8">PRICE</th>
                <th className="text-center px-8">AMOUNT</th>
                <th className="text-center px-8">STATUS</th>
                <th className="text-center px-8"></th>
                <th className="text-center"></th>
              </thead>
              <tbody>
                {rents.map((sale, i) => {
                  const { pack: packsAddress } = getAddresses(sale.blockchain);
                  const pack = sale.nft == packsAddress;
                  return (
                    <tr
                      className={clsx({
                        ["border-b border-overlay-border"]:
                          i < rents.length - 1,
                      })}
                    >
                      {sale && (
                        <Rent
                          {...{ sale, pack, setCancelId: setCancel, show }}
                        />
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <>
            <img src={Icons.logo} className="h-40 w-40" alt="" />
            <Typography
              type="subTitle"
              className={clsx(Styles.title, "text-primary")}
            >
              You don't have any item yet
            </Typography>
          </>
        )}
      </div>
    </div>
  );
};

export default Rents;

const Rent = ({ sale: rent, pack, setCancelId, show }) => {
  const cards = convertArrayCards();

  const StatusInfo = ({ status }) => {
    console.log(status);
    switch (status) {
      case "0":
        return "Rent Listed";
      case "1":
        return "NFT In Rent";
      case "2":
        return "Rent FInished";
      case "3":
        return "Rent Cancelled";
    }
  };

  return (
    <>
      <td className="py-4 px-4">
        <div className="flex flex-col items-center gap-y-2 w-full">
          <div className="rounded-xl flex flex-col text-gray-100 relative overflow-hidden border border-gray-500 h-20 w-20">
            <img
              src={
                pack
                  ? packs[rent.nftId]?.properties?.image?.value
                  : cards[rent.nftId]?.properties.image?.value
              }
              className={`absolute top-[-20%] bottom-0 left-[-40%] right-0 margin-auto min-w-[175%]`}
              alt=""
            />
          </div>
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-primary-disabled text-xl font-bold">
              {pack
                ? packs[rent.nftId]?.properties?.name?.value
                : cards[rent.nftId]?.properties.name?.value}
            </h2>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex flex-col items-center">
          <h2 className="text-white text-lg font-bold">#{rent.id}</h2>
        </div>
      </td>

      <td className="py-4 px-4">
        <div className="flex flex-col items-center pr-2">
          <h2 className="text-white text-lg font-bold">
            {formatPrice(rent.price, rent.blockchain)}
          </h2>
        </div>
      </td>

      <td className="py-4 px-4">
        <div className="flex flex-col items-center just">
          <h2 className="text-white text-lg font-bold">{rent.amount}</h2>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex flex-col items-center just">
          {
            <h2 className="text-white font-bold text-sm">
              {StatusInfo({ status: rent.status })}
            </h2>
          }
        </div>
      </td>

      <td className="py-4 px-4">
        <div className="flex flex-col items-center just">
          {rent.status === "0" && (
            <Button
              decoration="line-white"
              className="text-white hover:text-overlay rounded-xl"
              size="small"
              onClick={() => {
                setCancelId({
                  id: rent.rentId,
                  blockchain: rent.blockchain,
                });
                show();
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </td>

      <td className="py-4 pr-4">
        <Link href={`/rent/${rent.id}`}>
          <div className="flex flex-col items-center just">
            <Button
              decoration="fill"
              className="!text-overlay hover:!text-white rounded-xl"
              size="small"
            >
              Go to Rent
            </Button>
          </div>
        </Link>
      </td>
    </>
  );
};