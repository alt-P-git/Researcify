import axios from "axios";

export const view = async (paperId, type, displayErrorMessage, setErrorMessage) => {
  setErrorMessage("Loading...");
  try {
    const response = await axios.get(`/view/${type}/${paperId}`, {
      responseType: "blob",
    });
    if (response.status === 200) {
      setErrorMessage("");
      const fileURL = window.URL.createObjectURL(
        new Blob([response.data], { type: response.headers["content-type"] })
      );
      const fileLink = document.createElement("a");
      fileLink.href = fileURL;
      fileLink.setAttribute("target", "_blank");
      fileLink.click();
    }
  } catch (error) {
    if (error.response.status === 404) {
      displayErrorMessage("File not found on server");
    } else if (error.response.status === 500) {
      displayErrorMessage("Server error");
    } else {
      console.error("An error occurred:", error);
    }
  }
};