document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("productForm");

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Mencegah pengiriman form secara default

        // Mengambil nilai input secara manual
        const name = document.getElementById("name").value;
        const description = document.getElementById("description").value;
        const price = document.getElementById("price").value;
        const stock = document.getElementById("stock").value;
        const fileInput = document.getElementById("file");
        const file = fileInput.files[0]; // Mengambil file yang diunggah

        // Membuat objek FormData
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("stock", stock);
        formData.append("file", file);

        try {
            const response = await fetch("/api/product/add", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            alert(data.message); // Menampilkan pesan dari server
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            alert('Error: ' + error.message);
        }
    });
});
