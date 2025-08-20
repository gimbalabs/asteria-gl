import React from 'react';
import CreateShipComponent from "~/components/user/CreateShipComponent";
import GatherFuel from "~/components/user/GatherFuelComponent";
import MoveShipComponent from "~/components/user/moveShipCompoment";
import Quit from "~/components/user/Quit";
import SelectPilot from "~/components/user/SelectPilot";
import { AssetExtended } from "@meshsdk/core";
import { useState } from "react";
import { MatchingPellet } from '~/pages/map';

export default function GameActionsModal({pilot, setPilot, newPosX, newPosY, handleMoveShip, handleShipState, shipStateDatum, matchingPelletUtxo, actionModal, setActionModal}
  : {pilot: AssetExtended | null, setPilot: any, newPosX: number, newPosY: number, handleMoveShip: any, handleShipState: any, shipStateDatum: any, matchingPelletUtxo: MatchingPellet, actionModal: boolean, setActionModal: React.Dispatch<React.SetStateAction<boolean>>}) {



  return (
    <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 bg-gray-900 text-white shadow-2xl flex flex-col z-40">
      
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-800">
        <h2 className="text-xl font-bold">Game Actions</h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-grow overflow-y-auto">
        <div className="p-4 space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Create Ship</h3>
            <CreateShipComponent />
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <SelectPilot pilot={pilot} setPilot={setPilot} />
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Move Ship</h3>
            <MoveShipComponent pilot={pilot} newPosX={newPosX} newPosY={newPosY} handleMoveShip={handleMoveShip} handleShipState={handleShipState} shipStateDatum={shipStateDatum} />
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Gather Fuel</h3>
            {matchingPelletUtxo.txHash ? <GatherFuel pilot={pilot} matchingPelletUtxo={matchingPelletUtxo} />: null}
            {actionModal && <ActionModal setActionModal={setActionModal}/>}
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Quit Game</h3>
            <Quit pilot={pilot} />
          </div>
        </div>
      </div>
    </div>
  );
} 


const ActionModal =({setActionModal}: {setActionModal: React.Dispatch<React.SetStateAction<boolean>>}) => {

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center"
      >
      <div className="flex flex-col items-center bg-white rounded-md shadow-md p-4 w-1/2">
        <h2 className="text-galaxy-info text-lg font-bold mb-4">Great Job!</h2>
        <p className="text-galaxy-info text-sm mb-4">You've docked with a fuel station, You can gather fuel if you wish</p>
        <button onClick={() => setActionModal(false)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Close
        </button>
    </div>
</div>
  )

}