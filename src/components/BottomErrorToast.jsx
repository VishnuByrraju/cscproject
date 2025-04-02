function BottomToast({ text="This is a Notificaiton Toast" }) {
    return (
        <div className={`fixed bottom-0 left-0 w-full p-4 bg-red-500 text-white text-center`}>
          <div className='text-1.5'> {text}</div>
        </div>
    );
}

export default BottomToast;