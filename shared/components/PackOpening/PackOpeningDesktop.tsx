"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import clsx from "clsx";
import React from "react";
import AnimatedPackCard from "./AnimatedPackCard";

export const PackOpening = ({
  cards,
  setNoAudio,
  arrayPacks,
  updateBalance,
  animating,
  openPack,
  cardsPack,
  isLoading,
  videoPlaying,
  setVideoPlaying,
  refAudioLoop,
  backgroundSound,
  setBackgroundSound,
  cardToOpen,
  startFlashing,
  setStartFlashing,
  startFlashingPack,
  setStartFlashingPack,
  endPackOpening,
  packAnimation,
  video,
  show,
  mute,
}: any) => {
  const vidRef1 = React.useRef<any>(null);
  const vidRef2 = React.useRef<any>(null);
  const vidRef3 = React.useRef<any>(null);
  const vidRef4 = React.useRef<any>(null);

  React.useEffect(() => {
    const audio: any = document.getElementsByClassName("videoPack");
    if (audio) {
      for (const element of audio) {
        element.volume = 0.3;
      }
    }
  }, [video]);

  React.useEffect(() => {
    if (startFlashing === true) {
      setTimeout(() => {
        setStartFlashing(false);
      }, 4000);
    }
  }, [startFlashing]);

  React.useEffect(() => {
    if (startFlashingPack === true) {
      setTimeout(() => {
        setStartFlashingPack(false);
      }, 2000);
    }
  }, [startFlashingPack]);

  const handlePlayVideo = () => {
    vidRef1?.current?.play();

    vidRef2?.current?.play();

    vidRef3?.current?.play();

    vidRef4?.current?.play();
  };

  React.useEffect(() => {
    handlePlayVideo();
  }, [video, videoPlaying]);

  return (
    <div
      className={clsx(
        "min-h-screen w-full relative overflow-hidden md:block hidden",
      )}
      style={{ backgroundColor: "#111" }}
    >
      <div
        className={clsx(
          { hidden: video },
          "md:absolute flex md:gap-40 gap-10 justify-center items-center md:top-16 md:mt-0 mt-6 md:h-12 h-8 left-0 right-0 m-auto text-center",
        )}
      >
        <img
          className={clsx("titlePacks", "h-full cursor-pointer z-50")}
          src="./videos/packVideos/mypacks.png"
          alt="my packs title"
        />
        <img
          className={clsx("titlePacks", "h-full cursor-pointer z-50")}
          onClick={() => {
            show();
          }}
          src="./videos/packVideos/historyDesktop.png"
          alt="history title"
        />
      </div>
      {!video && (
        <div className="absolute top-16 right-12 z-50 w-8">
          <img
            src={
              backgroundSound
                ? "/images/packs/Mute-Off-Icon.png"
                : "/images/packs/Mute-On-Icon.png"
            }
            className="cursor-pointer"
            onClick={() => {
              if (backgroundSound) {
                if (refAudioLoop) {
                  setBackgroundSound(false);
                  refAudioLoop.current.pause();
                }
              } else {
                if (refAudioLoop) {
                  setBackgroundSound(true);
                  refAudioLoop.current.play();
                }
              }
            }}
            alt=""
          />
        </div>
      )}
      <div className="absolute left-0 right-0 mx-auto z-0 flex items-center justify-center w-full  bgPackContainer">
        {!video && (
          <img
            src="./videos/bgPackNoOpen.png"
            className={clsx("bgPackImage z-0")}
            alt=""
          />
        )}
      </div>
      <div className="absolute top-0 left-0 right-0 mx-auto flex items-center justify-center w-full h-full bgPackContainer">
        {!video && (
          <img
            src="./videos/packVideos/borderDesktop.png"
            className={clsx("w-full h-full z-40 hidden md:block")}
            alt=""
          />
        )}
      </div>
      <div
        className={clsx(
          { "min-h-screen": !(videoPlaying === 3 && video) },
          { "h-[calc(100vh-56px)]": videoPlaying === 3 && video },
          "w-full flex md:items-center md:justify-center relative",
          { "!items-start !justify-start": video },
        )}
      >
        <>
          {video ? (
            <>
              <div className="w-full h-full md:block hidden">
                <video
                  ref={vidRef1}
                  className={clsx(
                    { hidden: videoPlaying !== 0 },
                    "h-full absolute z-20 videoPack",
                  )}
                  // controls
                  src={`./videos/packVideos/card_${packAnimation}_normal.webm`}
                  muted={videoPlaying !== 0}
                  onEnded={
                    videoPlaying === 0 ? () => endPackOpening() : undefined
                  }
                ></video>

                <video
                  ref={vidRef2}
                  className={clsx(
                    { hidden: videoPlaying !== 1 },
                    "h-full absolute z-20 videoPack",
                  )}
                  // controls
                  muted={videoPlaying !== 1}
                  src={`./videos/packVideos/card_${packAnimation}_epic.webm`}
                  onEnded={
                    videoPlaying === 1 ? () => endPackOpening() : undefined
                  }
                ></video>

                <video
                  ref={vidRef3}
                  className={clsx(
                    { hidden: videoPlaying !== 2 },
                    "h-full absolute z-20 videoPack",
                  )}
                  // controls
                  muted={videoPlaying !== 2}
                  src={`./videos/packVideos/card_${packAnimation}_legendary.webm`}
                  onEnded={
                    videoPlaying === 2 ? () => endPackOpening() : undefined
                  }
                ></video>

                <video
                  ref={vidRef4}
                  className={clsx(
                    { hidden: videoPlaying !== 3 },
                    "h-full videoDesktop videoPack",
                  )}
                  // controls
                  muted={videoPlaying !== 3}
                  src="./videos/packVideos/Comp.mp4"
                ></video>
              </div>
            </>
          ) : arrayPacks && arrayPacks.length !== 0 ? (
            <>
              <div
                className={clsx(
                  "flex items-center justify-start relative containerPacks maxWscreen",
                )}
              >
                <div
                  id="container"
                  className={clsx(
                    !animating ? "overflow-x-scroll w-full" : "overflow-hidden",
                    "flex gap-10 items-center z-40 justify-start md:mx-10 md:px-6 p-8 md:h-screen h-40",
                  )}
                  onWheel={(e) => {
                    e.preventDefault();
                    let container = document.getElementById("container");
                    let containerScrollPosition =
                      document?.getElementById("container")?.scrollLeft;
                    container?.scrollTo({
                      top: 0,
                      left: (containerScrollPosition ?? 0) + e.deltaY,
                    });
                  }}
                >
                  {arrayPacks.map((pack: any, index: number) => {
                    return (
                      <img
                        key={"pack" + pack.id + index}
                        src={`./images/${pack.id}.png`}
                        className={clsx(
                          animating
                            ? cardToOpen[index]
                              ? `animating-${index} animatingCardToOpen-${index}`
                              : `animating-${index} animating-notCard`
                            : "",
                          `cursor-pointer pack z-40`,
                        )}
                        onClick={
                          !animating && !isLoading
                            ? () => openPack(index, pack.id)
                            : undefined
                        }
                        alt=""
                      />
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center">
                <h2 className="text-red-600 font-bold text-2xl">
                  You don't have packs to open
                </h2>
              </div>
            </>
          )}

          <div
            className={clsx("absolute w-full h-full blurContainer", {
              hidden: !startFlashing,
            })}
          ></div>

          <div
            className={clsx("absolute w-full h-full blurContainerPack", {
              hidden: !startFlashingPack,
            })}
          ></div>

          <div
            className={clsx(
              { hidden: videoPlaying !== 3 },
              "absolute bottom-0 right-0 m-10 mb-20 z-[10000] cursor-pointer titleNext text-yellow-400 font-bold",
            )}
            onClick={() => {
              setStartFlashingPack(true);
              setTimeout(() => {
                setVideoPlaying(-1);
                setNoAudio(false);
                updateBalance();
              }, 1100);
            }}
          >
            NEXT
          </div>
          {video && (
            <div
              id="container-cards"
              className={clsx(
                { ["hidden"]: videoPlaying !== 3 },
                {
                  "absolute top-0 bottom-0 left-0 right-0 m-auto flex overflow-x-auto items-center z-0 md:gap-10 gap-6 w-full h-screen px-10":
                    videoPlaying === 3,
                },

                {
                  "md:justify-center": cardsPack.length <= 5,
                },

                {
                  "justify-start px-10": cardsPack.length > 5,
                },
              )}
              onWheel={(e) => {
                e.preventDefault();
                let container = document.getElementById("container-cards");
                let containerScrollPosition =
                  document?.getElementById("container-cards")?.scrollLeft;
                container?.scrollTo({
                  top: 0,
                  left: (containerScrollPosition ?? 0) + e.deltaY,
                });
              }}
            >
              {cardsPack.map((id: number, index: number) => {
                return (
                  <React.Fragment key={index + "card"}>
                    <AnimatedPackCard
                      cardFront={cards[id]?.image}
                      cardType={cards[id]?.typeCard}
                      cardId={id}
                      className={`card-${index + 1}`}
                    />
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </>
      </div>
    </div>
  );
};
