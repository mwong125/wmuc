const MERIDIEMS = ['am', 'pm'];

function Hour(props) {
  let hour12 = props.hour;
  let meridiem = MERIDIEMS[0];
  
  if (hour12 > 12) {
    hour12 -= 12;
    if (hour12 !== 12) {
      meridiem = MERIDIEMS[1];
    }
  } else if (hour12 === 12) {
    meridiem = MERIDIEMS[1];
  } else if (hour12 === 0) {
    hour12 = 12;
  }

  let hours = Math.floor(hour12);
  let minutes = hour12 - hours;
  if (minutes > 0) {
    hour12 = hours + ':' + Math.floor(minutes*60);
  }

  return hour12 + meridiem;
}

export default Hour;