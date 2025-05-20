import React from 'react'

const FileErrorAlert = () => {
  return (
      <div>
          {/* Open the modal using document.getElementById('ID').showModal() method */}
<button className="btn hidden" onClick={()=>document.getElementById('my_modal_5').showModal()}>open modal</button>
<dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Empty File/Input!</h3>
    <p className="py-4">Image and name inputs are Empty, Please Fill to Mint your Artwork.</p>
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

export default FileErrorAlert
