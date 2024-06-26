import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./App.css";
import { IProductWidget } from "seb-components-library";
import {
  ProductWidget,
  ToolTip,
  productWidgetColors,
  LoadingSpinner,
} from "seb-components-library";
import { fetchData } from "./Shared/ApiMock";

export default function App() {
  const [productData, setProductData] = useState<IProductWidget[]>([]);
  const tooltipRef = useRef<HTMLElement>(null);
  const tooltipLinkRef = useRef<HTMLElement>(null);
  const [isShowing, setIsShowing] = useState(false);
  const [coords, setCoords] = useState({ left: 5, top: 20 });
  const [currentId, setCurrentId] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);

  function onAnimationEnd(e: any) {
    if (e.animationName === "fadeOutOpacity") {
      e.target.className = "hidden-after-animation";
    }
  }

  const handleOnMouseEnter = (
    e: {
      target: { nodeName: string; getBoundingClientRect: () => any };
    },
    timeOut: number
  ) => {
    if (!isShowing && e.target.nodeName === "IMG") {
      setTimeout(() => {
        const position = e.target.getBoundingClientRect();
        setCoords({ left: position.left, top: position.top });
        setIsShowing(true);
      }, timeOut);
    }
  };
  useEffect(() => {
    fetchData().then(
      (res) => {
        setProductData(res)
      }
    ).catch(
      (error: any) => {
        console.error(error)
      }
    ).finally(
      () => {
        setIsLoading(false)
      }
    );
  }, []);

  useLayoutEffect(() => {
    tooltipRef.current!.classList.add("hidden-after-animation");
  }, []);

  useEffect(() => {
    if (!isShowing && tooltipRef.current) {
      tooltipRef.current.classList.add("hidden");
    } else if (isShowing && tooltipRef.current) {
      tooltipRef.current.classList.remove("hidden");
    }
  }, [isShowing]);

  const outsideClick = (e: any) => {
    if (tooltipRef.current && !tooltipRef.current.contains(e.target)) {
      setIsShowing(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", outsideClick);
    return () => {
      document.removeEventListener("click", outsideClick);
    };
  }, []);

  return (
    <div className="App">
      <h1>Per product widgets</h1>
      <hr></hr>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="CardsContainer">
          {productData.map((x) => {
            return (
              <ProductWidget
                key={x.id}
                amount={x.amount}
                action={x.action}
                id={x.id}
                active={x.active}
                type={x.type}
                linked={x.linked}
                availableColors={Object.values(productWidgetColors)}
                selectedColor={x.selectedColor}
                handleCheckboxClick={(e: { target: { checked: boolean } }) => {
                  setProductData((prev: IProductWidget[]) => {
                    const newArray = prev.map((y) => {
                      if (x.id === y.id) {
                        y.linked = e.target.checked;
                      }
                      return y;
                    });
                    return newArray;
                  });
                }}
                handleSwitchClick={(e: { target: { checked: boolean } }) => {
                  setProductData((prev: IProductWidget[]) => {
                    const newArray = prev.map((y) => {
                      if (x.id === y.id) {
                        y.active = e.target.checked;
                      } else {
                        y.active = false;
                      }
                      return y;
                    });
                    return newArray;
                  });
                }}
                handleColorClick={(e: any, color: string) => {
                  const availableColors: string[] =
                    Object.values(productWidgetColors);
                  const index = availableColors.indexOf(color);
                  const selectedColor = Object.keys(productWidgetColors)[index];

                  setProductData((prev: IProductWidget[]) => {
                    const newArray = prev.map((y) => {
                      if (x.id === y.id) {
                        y.selectedColor =
                          productWidgetColors[
                          selectedColor as keyof typeof productWidgetColors
                          ];
                      }
                      return y;
                    });
                    return newArray;
                  });
                }}
                handleOnMouseEnter={(e) => handleOnMouseEnter(e, 300)}
                handleInfoMarkFocus={(e) => handleOnMouseEnter(e, 0)}
                handleInfoMarkBlur={() => {
                  setCurrentId(x.id);
                  tooltipLinkRef.current?.focus();
                }}
              />
            );
          })}
        </div>
      )}

      <dialog
        className={isShowing ? "seb-tooltip-container" : "hidden"}
        ref={tooltipRef as React.RefObject<HTMLDialogElement>}
        style={{ top: `${coords.top - 30}px`, left: `${coords.left - 150}px` }}
        onAnimationEnd={onAnimationEnd}
        onMouseLeave={(e) => {
          e.stopPropagation();
          setIsShowing(false);
        }}
      >
        <ToolTip
          tooltipAnchorRef={tooltipLinkRef}
          handleTooltipAnchorKeyPress={(e) => {
            if (e.key === "Tab") {
              setIsShowing(false);
              e.preventDefault();
              if (e.shiftKey) {
                const switchElement = document.getElementById(
                  `switch-${currentId - 1}`
                );
                switchElement?.focus();
                return;
              }
              const checkboxElement = document.getElementById(
                `checkbox-${currentId}`
              );
              checkboxElement?.focus();
            }
          }}
          target={"blank"}
          anchorContent={"View Public Profile"}
          href={"https://sebastian-meckovski.github.io/"}
          tootlipcontent={
            "This widget links directly to your public profile so that you can easily share your impact with your customers. Turn it off here if you do not want the badge to link to it."
          }
        />
      </dialog>
    </div>
  );
}