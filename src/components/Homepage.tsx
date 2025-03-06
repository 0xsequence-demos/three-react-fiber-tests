import { FC, useState } from "react";
import View3D from "./3d/View3D";
import ItemViewer3D from "./3d/ItemViewer3D";
import Chest from "./3d/Chest";
import "./Homepage.css";

export const Homepage: FC = () => {
  const [chestStatus, setChestStatus] = useState<"closed" | "shaking" | "open">(
    "closed",
  );
  return (
    <>
      <View3D env={"item"}>
        <ItemViewer3D>
          <Chest chestStatus={chestStatus} />
        </ItemViewer3D>
      </View3D>
      <div
        className="button"
        onClick={() => {
          setChestStatus(
            chestStatus === "closed"
              ? "shaking"
              : chestStatus === "shaking"
                ? "open"
                : "closed",
          );
        }}
      >
        {chestStatus === "closed"
          ? "PREPARE"
          : chestStatus === "shaking"
            ? "OPEN"
            : "CLOSE"}
      </div>
    </>
  );
};
