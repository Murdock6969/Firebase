
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
  import { getDatabase, ref, push, onValue, remove, set } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCF5Pm0wjN_1nNCgotDLqmRSkOOnQosX4E",
    authDomain: "fir-student-71f63.firebaseapp.com",
    projectId: "fir-student-71f63",
    storageBucket: "fir-student-71f63.firebasestorage.app",
    messagingSenderId: "194583781148",
    appId: "1:194583781148:web:c2c8d8fe1c89d845de24d9"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const createdatabase = getDatabase(app)
  const detailname = ref(createdatabase, "stud-dets")

  let studentmain = document.getElementById("stud-main")
  let studname = document.getElementById("nameid")
  let studage = document.getElementById("ageid")
  let studcourse = document.getElementById("courseid")
  let studdate = document.getElementById("dojid")
  let studsub = document.getElementById("but-sub")
  let studform = document.getElementById("studentcontent")
  let editid = null;
  

  studentmain.addEventListener("submit" , (e)=>{
    e.preventDefault();
    const studentnamevalidation = studname.value.trim();
    const studentagevalidation = studage.value.trim();
    const studentcoursevalidation = studcourse.value.trim();
    const studentdatevalidation = studdate.value.trim();
    // alert(studentagevalidation+studentnamevalidation+studentcoursevalidation+studentdatevalidation)

    const createstudent = {
        Name:studentnamevalidation,
        Age:studentagevalidation,
        Course:studentcoursevalidation,
        Date:studentdatevalidation
    }


    if (editid) {
        set(ref(createdatabase,`stud-dets/${editid}`),createstudent)
        alert('data edited')
        cleardatas();
    }else{
        push(detailname,createstudent)
        cleardatas()

    }
  })

  function cleardatas() {
    studname.value = "";
    studage.value = "";
    studcourse.value = "";
    studdate.value = "";
    
  }

  onValue(detailname,function (snapshot) {
    if (snapshot.exists()){
        let alldata = Object.entries(snapshot.val())
        console.log(alldata);
        studform.innerHTML = ''
        alldata.forEach((particular)=>{
            // console.log(particular);
            // console.log(particular);
            const userid = particular[0]
            const studentmain = particular[1]
            console.log( studentmain);

            studform.innerHTML += ` <tr>
                        <td style="padding-right: 10px;">${studentmain.Name}</td>
                        <td style="padding-right: 10px;">${studentmain.Age}</td>
                         <td style="padding-right: 10px;">${studentmain.Course}</td>
                          <td style="padding-right: 10px;">${studentmain.Date}</td>
                        <td style="padding-right: 10px;"><button class = "editbutstu"data-id="${userid}">Edit</button></td>
                        <td style="padding-right: 10px;"><button class = "delbutstu" data-id="${userid}">Delete</button></td>
                    </tr>
            `
            
            
            
        })
        
    }
    else{
        studform.innerHTML = "No Data Entered"

    }
  })

  document.addEventListener('click',(event)=>{
    if (event.target.classList.contains('editbutstu')) {

        let exactdata = event.target.dataset.id;
        // alert(exactdata)  
        let rrr = event.target.closest('tr').children;
        studname.value = rrr[0].innerHTML;
        studage.value = rrr[1].innerHTML;
        studcourse.value = rrr[2].innerHTML;
        studdate.value = rrr[3].innerHTML;
        editid = exactdata

        // alert('editbutstu')





    } else if(event.target.classList.contains('delbutstu')){
        // alert('delbutstu')

        if (confirm('Delete student data ?')) {
            let exactdata = event.target.dataset.id;
            // alert(exactdata)
            remove(ref(createdatabase,`stud-dets/${exactdata}`))
            
        }

    }
        
    
  })

  const searchInput = document.getElementById('searchInput');

  searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.trim().toLowerCase(); // Get the search term

    onValue(detailname, (snapshot) => {
      if (snapshot.exists()) {
          let alldata = Object.entries(snapshot.val());
          let filteredData = alldata.filter((particular) => {
            const userdata = particular[1];

            return (
              userdata.Name.toLowerCase().includes(searchTerm) ||
              userdata.Age.toLowerCase().includes(searchTerm) ||
              userdata.Course.toLowerCase().includes(searchTerm) ||
              userdata.Date.toLowerCase().includes(searchTerm)

          );
      });


      studform.innerHTML = '';
      if (filteredData.length > 0) {
          filteredData.forEach((eachdata) => {
              const userid = eachdata[0];
              const userdata = eachdata[1];
              
               studform.innerHTML += `
                <tr>
                            <td>${userdata.Name}</td>
                            <td>${userdata.Age}</td>            
                            <td>${userdata.Course}</td>            
                            <td>${userdata.Date}</td>            
                           <td><button class = "editbutstu"data-id="${userid}">Edit</button></td>
                           <td><button class = "delbutstu" data-id="${userid}">Delete</button></td>
                        </tr>
                    `;
                });

              } else {
                studform.innerHTML = '<tr><td>No matching appointments found.</td></tr>';
            }
        } else {
          studform.innerHTML = '<tr><td>No appointments available.</td></tr>';
        }
    });
});
