import { toast } from 'react-hot-toast';

export const validateRoom = (roomData) => {
  if (!roomData?.roomName?.trim()) {
    toast.error('Please add a Name');
    throw false;
  }

  if (!roomData?.roomDescription?.trim()) {
    toast.error('Please add a Description');
    throw false;
  }

  if (!roomData?.roomLevel?.trim()) {
    toast.error('Please select  Level');
    throw false;
  }

  if (!Array.isArray(roomData.roomLanguage) || roomData.roomLanguage.length === 0 || !roomData.roomLanguage[0]) {
    toast.error('Please select Language');
    throw false;
  }
  roomData.roomLanguage=roomData.roomLanguage.join(' + ')

  return true;
};