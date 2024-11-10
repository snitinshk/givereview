import { useState, useEffect } from "react";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Timer = (props: any) => {
    const { initialMinute, initialSeconds, setTimmer } = props;
    const [minutes, setMinutes] = useState(initialMinute);
    const [seconds, setSeconds] = useState(initialSeconds);
    useEffect(() => {
        const myInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
                setTimmer({ second: seconds - 1, minute: minutes });
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(myInterval);
                } else {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                    setTimmer({ second: 59, minute: minutes - 1 });
                }
            }
        }, 1000);
        if (!(minutes || seconds)) {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            props?.onTimmerClose && props?.onTimmerClose();
        }
        return () => {
            clearInterval(myInterval);
        };
    }, [seconds]);

    useEffect(() => {
        if (!props?.isResendOtp && !props.isThanksPopup) {
            setMinutes(initialMinute);
            setTimmer({ second: initialSeconds, minute: initialMinute });
            setSeconds(initialSeconds);
        }
    }, [props?.isResendOtp]);

    return (
        <>
            {minutes || seconds ? (
                <div className='timmer'>
                    {" "}
                    {minutes < 10 ? `0${minutes}` : minutes} <span className='separator'>:</span>{" "}
                    <span className='seconds'>
                        {seconds < 10 ? `0${seconds}` : seconds}
                    </span>
                </div>
            ) : (
                <></>
            )}
        </>
    );
};

export default Timer;
