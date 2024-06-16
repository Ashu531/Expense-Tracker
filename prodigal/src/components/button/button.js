import React, { useEffect, useState } from 'react';
import './button.css';

export default function Button({
    text,
    count='',
    leadingIcon,
    classes='',
    onClick,
    disabled=false,
    showTextOnHover=false,
    textClass='',
    type
}) {

  const [buttonPressed,setButtonPressed] = useState(false);

  useEffect(() => {
    return () => {
      setButtonPressed(false)
    };
  }, []);


  const _handleButtonClick = () => {
    setButtonPressed(true)
    onClick()
  }

  return (
    <div className={`plms-button-component ${disabled ? 'plms-disable' : ''}`} style={classes} onClick={()=>_handleButtonClick()}> 
        {leadingIcon && <img src={leadingIcon}/>}
        {!!count && <div className={'plms-text'}>{count}</div>}
        {text && <div className={showTextOnHover ? 'plms-hideText plms-text' : 'plms-text'} style={type == 'Show' ? {color : '#FFFFFF',...textClass} : textClass }>{text}</div>}
    </div>
  )
}


