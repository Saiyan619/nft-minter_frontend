import React from 'react'

const LoadingModal = () => {
  return (
    <div>
          {/* Open the modal using document.getElementById('ID').showModal() method */}
<button className="btn hidden" onClick={()=>document.getElementById('my_modal_6').showModal()}>open modal</button>
<dialog id="my_modal_6" className="modal modal-bottom sm:modal-middle">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Minting in Process</h3>
    <p className="py-4">Almost Done, Waiting for Payment Confirmation</p>
    <div className="modal-action">
      <form method="dialog">
        {/* if there is a button in form, it will close the modal */}
        <button className="btn">Close</button>
      </form>
    </div>
  </div>
</dialog>
</div>
  )
}

export default LoadingModal
