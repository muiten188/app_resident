import App from '../'

export const showModal = (modalContent) => {
  if (App.getInstance())
    App.getInstance().showModal(modalContent);
}

export const hideModal = () => {
  if (App.getInstance())
    App.getInstance().hideModal();
}