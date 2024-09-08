import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DateRangePicker.css';

const DateRangePicker = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  return (
    <div className='date-range-picker-container'>
      <div className='date-range-picker-label'>조회 기간</div>
      <DatePicker className='date-range-picker'
        selectsRange={true}
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {
          setDateRange(update);
        }}
        isClearable={true}
        dateFormat="yyyy/MM/dd"
        placeholderText="기간 선택"
      />
    </div>
  );
};

export default DateRangePicker;