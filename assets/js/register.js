const dropContainer = document.getElementById("dropcontainer")
const fileInput = document.getElementById("images")

dropContainer.addEventListener("dragover", (e) => {
  
  e.preventDefault()
}, false)

dropContainer.addEventListener("dragenter", () => {
  dropContainer.classList.add("drag-active")
})

dropContainer.addEventListener("dragleave", () => {
  dropContainer.classList.remove("drag-active")
})

dropContainer.addEventListener("drop", (e) => {
  e.preventDefault()
  dropContainer.classList.remove("drag-active")
  fileInput.files = e.dataTransfer.files
});


import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'https://mavnvirtkvhbnvtmiddk.supabase.co';
const secretKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hdm52aXJ0a3ZoYm52dG1pZGRrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MzUwMDYyOSwiZXhwIjoyMDA5MDc2NjI5fQ.cWFtEEnx4NWVVH3gmSDbHZ4hgi5ZJ4mZmKQkChz-e9o';

const supabase = createClient(supabaseUrl, secretKey);

const postForm = document.querySelector('.post-form');
const postList = document.querySelector('.post-lists');

const addPost = async (e) => {
    e.preventDefault();
    const postFormData = Object.fromEntries(new FormData(postForm));

    try {
        
        const response = await fetch(`${supabaseUrl}/rest/v1/users`, {
            method: 'POST',
            body: JSON.stringify({
                username: postFormData.username,
                password: postFormData.password,
                name: postFormData.name,
                age: postFormData.age,
                image: postFormData.image.name
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${secretKey}`,
                'apikey': secretKey
            }
        });

       
        if (response.ok) {
            
            alert("Başarıyla kayıt olundu!");
            window.location.href = "login.html";
            
            await supabase
                .storage
                .from('image')
                .upload(postFormData.image.name, postFormData.image, {
                    cacheControl: '3600',
                    upsert: false
                });
        } else {
            
            alert("Kayıt olma işlemi başarısız oldu.");
        }
    } catch (error) {
        console.error("Hata:", error);
    }
}

postForm.addEventListener('submit', addPost);