const baseUrl = "https://safeskyimageapi.onrender.com";

document.getElementById("uploadButton").addEventListener("click", async function uploadFile(e) {
    const formData = new FormData();
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    formData.append("imageInput", file);

    const url = `${baseUrl}/upload_image`;

    // Confirming before proceeding
    const confirmation = confirm("Proceed with the upload?");
    if (!confirmation) {
        return;
    }

    const status = document.getElementById("statusMessage");
    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (response.ok) {
            status.innerHTML = `${result.status}`;
            if (result.status === "hazardous") {
                document.getElementById("warningButton").click();
            }
        } else {
            status.innerHTML = `${result.response}`;
        }
        console.log(result);
    } catch (error) {
        console.error(error);
        status.innerHTML = `Invalid Image Format <i class="fa-solid fa-skull-crossbones"></i>`;
    }

    e.preventDefault();
});
