import React from 'react'

const SuccessModal = () => {
  return (
    <div>
        {/* Open the modal using document.getElementById('ID').showModal() method */}
<button className="btn hidden" onClick={()=>document.getElementById('my_modal_7').showModal()}>open modal</button>
<dialog id="my_modal_7" className="modal modal-bottom sm:modal-middle">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Minting SuccessFul</h3>
                  <p className="py-4">Congratulations your ART is going on the BlockChain!!</p>
                  <p className="py-4">Make sure to complete the process by paying the Mint Price.</p>
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

export default SuccessModal
