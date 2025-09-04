import React from 'react'
import { RoomData } from '../types/assessment'
import { Home, Trash2 } from 'lucide-react'

interface RoomDimensionsInputProps {
  numRooms: number
  roomData: RoomData[]
  onChange: (rooms: RoomData[]) => void
}

const roomPurposeOptions = [
  'Vegetation',
  'Flowering', 
  'Mother Room',
  'Clone Room',
  'Drying',
  'Trimming',
  'Storage',
  'Lab/Testing',
  'Office Space',
  'Processing',
  'Packaging',
  'Quarantine',
  'Utility',
  'Other'
]

export function RoomDimensionsInput({ numRooms, roomData, onChange }: RoomDimensionsInputProps) {
  // Ensure we have the right number of room entries
  const ensureRoomData = () => {
    const rooms = [...roomData]
    
    // Add missing rooms
    while (rooms.length < numRooms) {
      rooms.push({
        room_number: rooms.length + 1,
        length_ft: 0,
        width_ft: 0,
        purpose: ''
      })
    }
    
    // Remove extra rooms
    if (rooms.length > numRooms) {
      rooms.splice(numRooms)
    }
    
    // Update room numbers to ensure they're sequential
    rooms.forEach((room, index) => {
      room.room_number = index + 1
    })
    
    return rooms
  }

  const updateRoom = (index: number, field: keyof RoomData, value: any) => {
    const rooms = ensureRoomData()
    rooms[index] = { ...rooms[index], [field]: value }
    onChange(rooms)
  }

  const rooms = ensureRoomData()

  if (numRooms === 0) return null

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Home className="w-5 h-5 text-[#11b981]" />
        <h4 className="text-lg font-medium text-gray-800">Room Details</h4>
      </div>
      
      {rooms.map((room, index) => (
        <div 
          key={index}
          className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-medium text-gray-700">Room {room.room_number}</h5>
            <div className="text-sm text-gray-500">
              {room.length_ft && room.width_ft ? 
                `${(room.length_ft * room.width_ft).toFixed(0)} sq ft` : 
                'Calculate sq ft by entering dimensions'
              }
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Length (ft)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={room.length_ft || ''}
                onChange={(e) => updateRoom(index, 'length_ft', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#11b981] focus:border-transparent"
                placeholder="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Width (ft)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={room.width_ft || ''}
                onChange={(e) => updateRoom(index, 'width_ft', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#11b981] focus:border-transparent"
                placeholder="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Room Type
              </label>
              <select
                value={room.purpose || ''}
                onChange={(e) => updateRoom(index, 'purpose', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#11b981] focus:border-transparent bg-white"
              >
                <option value="">Select type...</option>
                {roomPurposeOptions.map((purpose) => (
                  <option key={purpose} value={purpose}>
                    {purpose}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ))}
      
      <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
        <strong>Tip:</strong> Square footage is automatically calculated from length × width. 
        This data helps optimize your facility layout and identify efficiency opportunities.
      </div>
    </div>
  )
}