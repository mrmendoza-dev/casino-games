import { useEffect, useState } from "react";

export const Card = ({ value, suit, show, img }: any) => {
  const [showCard, setShowCard] = useState(show);
  const [isFlipping, setIsFlipping] = useState(false);

  const card = { value, suit, show, img };

  const handleClick = () => {
    animateFlip(!showCard);
  };

  const animateFlip = (newShowState: boolean) => {
    setIsFlipping(true);
    setTimeout(() => {
      setShowCard(newShowState);
      setIsFlipping(false);
    }, 150);
  };

  useEffect(() => {
    if (show !== showCard) {
      animateFlip(show);
    }
  }, [show]);

  return (
    <div
      className={`bg-[rgb(255,255,248)] aspect-[2/3] w-[100px] max-w-[200px] border border-[#5f5f5f] flex rounded-lg cursor-pointer transition-all duration-300 hover:scale-110 hover:z-10 hover:shadow-[0_0_10px_#353535] select-none overflow-hidden ${
        isFlipping ? "rotate-y-180" : ""
      }`}
      onClick={handleClick}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      {showCard ? (
        <img
          className="object-fit w-full px-1 py-1 pointer-events-none rounded-lg select-none backface-hidden"
          src={card.img}
          alt={`${value} of ${suit}`}
        />
      ) : (
        <img
          className="object-cover w-full h-full scale-105 pointer-events-none bg-white rounded-lg select-none backface-hidden overflow-hidden"
          src="./cards/back.png"
          alt="Card back"
        />
      )}
    </div>
  );
};
