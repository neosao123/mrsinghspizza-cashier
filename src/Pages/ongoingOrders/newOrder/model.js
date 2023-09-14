const NotDeliverableModel = ({
  setExtraDeliveryCharges,
  extraDeliveryCharges,
  isOpen,
  setIsOpen,
}) => {
  return (
    <div
      onClick={() => {
        setIsOpen(false);
      }}
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#1a1a1a63",
        display: isOpen ? "flex" : "none",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        top: "0",
        left: "0",
        zIndex: "9999",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "white",
          width: "40%",
          borderRadius: "5px",
          padding: "10px",
        }}
      >
        <h5>
          This zipcode is not deliverable. Do you want to apply extra delivery
          charges and deliver?
        </h5>
        <div className='d-flex flex-wrap my-2 my-2 justify-content-end align-items-center'>
          <div className='input-group w-100'>
            <div className='input-group-prepend'>
              <span className='input-group-text inputGroupTxt px-2'>$</span>
            </div>
            <input
              className='form-control w-25 text-end'
              type='number'
              placeholder='0.00'
              min='0'
              step='1'
              defaultValue={0}
              value={extraDeliveryCharges}
              onChange={(e) =>
                setExtraDeliveryCharges(e.target.value < 0 ? 0 : e.target.value)
              }
            ></input>
            <div className='input-group-append'>
              <span className='input-group-text inputGroupTxt'>CAD</span>
            </div>
          </div>
        </div>
        <div className='d-flex justify-content-between mt-4'>
          <button
            type='button'
            class='btn btn-secondary'
            onClick={() => setIsOpen(false)}
          >
            Close
          </button>
          <button
            type='button'
            style={{ backgroundColor: "#ff8c00" }}
            class='btn text-white'
            onClick={() => setIsOpen(false)}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotDeliverableModel;
