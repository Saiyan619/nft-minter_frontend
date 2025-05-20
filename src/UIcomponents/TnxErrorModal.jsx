import React from 'react'

const TnxErrorModal = () => {
  return (
    <div>
        {/* Open the modal using document.getElementById('ID').showModal() method */}
<button className="btn hidden" onClick={()=>document.getElementById('my_modal_8').showModal()}>open modal</button>
<dialog id="my_modal_8" className="modal modal-bottom sm:modal-middle">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Minting Error</h3>
                  <p className="py-4">Something went Wrong. Try again?</p>
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

export default TnxErrorModal
