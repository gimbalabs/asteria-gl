import { useState } from 'react'
import { api } from '~/utils/api'

export function MoveShip() {
    const [pilotName, setPilotName] = useState('')
    const [deltaX, setDeltaX] = useState(0)
    const [deltaY, setDeltaY] = useState(0)
  
    const utils = api.useUtils()
    const moveShip = api.utxo.moveShip.useMutation({
      onSuccess: () => {
        utils.utxo.getAll.invalidate()
        setDeltaX(0)
        setDeltaY(0)
      }
    })

    return (
        <div className="border rounded p-4 bg-white shadow">
          <h3 className="text-md text-galaxy-border font-semibold mb-2">Move Ship</h3>

            <button
              onClick={() => moveShip.mutate({ pilot: pilotName, deltaX, deltaY })}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded px-4 py-2"
            >
              Move
            </button>
          
        </div>
      )
    }