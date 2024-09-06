import { useState } from 'react';
import { Modal, Button, Datepicker } from 'flowbite-react'; // Assuming you're using Flowbite components

const DateTimePickerModal = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');

  const handleDatePickerChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = () => {
    console.log('Selected Date:', selectedDate);
    console.log('Start Time:', startTime);
    console.log('End Time:', endTime);
    setOpenModal(false);
  };

  return (
    <div>
      {/* Button to open the modal */}
      <Button onClick={() => setOpenModal(true)}>Open Date & Time Picker</Button>

      <Modal
        dismissible
        show={openModal}
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header>Set Time & Date</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            {/* Date Picker */}
            <Datepicker
              minDate={new Date()}
              value={selectedDate}
              onSelectedDateChanged={handleDatePickerChange}
            />
            
            {/* Time Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="start-time" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Start time:
                </label>
                <input
                  type="time"
                  id="start-time"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  min="09:00"
                  max="18:00"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="end-time" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  End time:
                </label>
                <input
                  type="time"
                  id="end-time"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  min="09:00"
                  max="18:00"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit}>
            Set Date & Time
          </Button>
          <Button
            color="gray"
            onClick={() => setOpenModal(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DateTimePickerModal;
