import { PDFDownloadLink} from "@react-pdf/renderer";
import React, { useEffect,memo } from "react";
import { useState } from "react";
import { useContext } from "react";
import AuthContext from "../authContext/AuthContext";
import RapportDataService from "../rapportDataService/RapportDataService";
import Rapport from "../rapportPdf/Rapport";
import { dataIntervention } from "./dataIntervention";
import BodyRapport2 from "./bodyRapport2";
import { getStorage, ref, getDownloadURL, uploadBytesResumable} from "firebase/storage";
import './monRapport.css'
import { useLocation } from "react-router-dom";
import ModalRef from "./ModalRef";
import Loader from "../loader/Loader";
import ModalUploadData from "../modalUploadData/ModalUploadData";






const MonRapport = () => {

    const location = useLocation()
    const {user} = useContext(AuthContext)
    const [dataLoading,setDataLoading] = useState(true)
    const [idRapport, setIdRapport] = useState(location.state.idDoc)
    const [dataSend,setDataSend] = useState(false)
    const [docIsCreated,setDocIsCreated] = useState(location.state.docIsCreated)
    const [dataInterPdf,setDataInterPdf] = useState([])
    const [infoUploadData, setInfoUploadData] = useState('')
    const [uploadSuccess, setUploadSuccess] = useState(false)
    const [openModalUpload,setOpenModalUpload] = useState(false)
    const storage = getStorage();
    const storageRef = ref(storage);
    const [urlFirebaseLoaded,setUrlFirebaseLoaded] = useState(false)    
    const [containFile,setContainFile] = useState(0)
    const [refIsNull,setRefIsNull] = useState(false)
    // const [dataInfoInter,setDataInfoInter] = useState(dataIntervention)
    const [infoInter, setInfoInter] = useState({
        uid: `${user.uid}`,       
        informationIntervention : {
             client : "",
             reference: "",
             vosReference:"",
             copro: "",
             franchise: "",
             contact : "",
             nomSinistre:"",
             lieuIntervention : "",
             dateIntervention: "",
             dateRapport:"",
             intervenant:"",
             typeDeBien : "",
             etage: "",
             situation:"",
             rapportFini:false
        }
     
    })
    const [dataInfoPdf,setDataInfoPdf] = useState(infoInter.informationIntervention) //retirer infoInter.info... et remetre {}

  const [dataInter, setDataInter] = useState(dataIntervention)



  const handleUploadStorageImage = async () => {

    let promisesImages = []
    let numberImage = []
    

   dataInter.forEach((data, indexData) => {    

   data.image.forEach((image,indexImage) => {

 
    
    if (image.file ) {

   const path = `${image.imageName}`;
   // console.log(storageRef)
   const imageRef = ref(storageRef, `${infoInter.informationIntervention.reference}/${path}`)


     const uploadTask = uploadBytesResumable(imageRef, image.file);
   numberImage.push(uploadTask)
   uploadTask.on('state_changed', 
  (snapshot) => {

    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');

  }, 
  (error) => {
    // Handle unsuccessful uploads
    console.log(error)
  }, 
    async () => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
  let promises = []

  const up = getDownloadURL(uploadTask.snapshot.ref)
   promises.push(up)
   promisesImages.push(up)

   await Promise.all(promises).then((res) => {

    setDataInter((prev) => prev.map((data, index) => {
      if (index === indexData) {     
        let neww = data.image.map((image, i) => {
       
             if (i === indexImage) {

               
               let dataImage = {...image,url : res[0],fileName: path}
               delete dataImage['file']  
            return dataImage
               
                                    }
       
             else{ return { ...image }}

          
          
          })
          return { ...data, image: neww }

                  
      }
      else { return data }
     
    }
    ))




   })
     
 Promise.all(promisesImages).then((res) => numberImage.length === res.length && setUrlFirebaseLoaded(true))

  })
   }
  }) 

  

// setaDataLoading(false) ????????????????????????


}) 
}


const handleChangeInfoInter = (e,name) => {

    setInfoInter({...infoInter,informationIntervention :{...infoInter.informationIntervention ,[name] : e}})                              
    
    }



const submitInformationInter = (e) => {
e.preventDefault()

 if(infoInter.informationIntervention.reference === ''){

     setRefIsNull(true)
     
 }else{

  if (containFile === 0){
  test()
 setDataLoading(false)

}else{

 handleUploadStorageImage()
 setDataLoading(false)

}}}




// const addNumberPhotos = () => {


//   setDataInter((prevState) => prevState.map((data) =>{
                     
//     if (data.image.length > 0){

//       const updatedImages = data.image.map((image) => {
//         counter++;
//         return { ...image, numberPhoto: counter };
//       });
    
//       return { ...data, image: updatedImages };
    
//     }else return data

//   }))
// }





const getRapport = async () => {

    const res = await RapportDataService.getRapport(idRapport)
    setDataInfoPdf(res.data().infoInter.informationIntervention)
    setDataInterPdf(res.data().dataInter)
    setInfoInter(res.data().infoInter)
    setDataInter(res.data().dataInter)
    setDataLoading(true)

  // console.log(res.data())
  setDataSend(false)
  setContainFile(0)
}
 

useEffect(() => {

(dataSend || location.state.getRapport) && getRapport()

// eslint-disable-next-line react-hooks/exhaustive-deps
},[dataSend])



const test = async () => {

    const data = {infoInter,dataInter}

    setInfoInter({...infoInter,uid : user.uid})
    
    
    docIsCreated ? await RapportDataService.updateRapport(idRapport,data).then(() =>{
      
      
      setDataSend(true)
      console.log('envoyé')
      setDataLoading(true)
     setDocIsCreated(true)
     setUrlFirebaseLoaded(false)
     setInfoUploadData('Le rapport a été enregistré avec succès')
     setUploadSuccess(true)
     setOpenModalUpload(true)


     setTimeout(() => {

      setOpenModalUpload(false)

     },3000)

    
    }).catch((error) => {
      
      setDataLoading(true)
      setUploadSuccess(false)     
     setInfoUploadData('Une erreur est survenue lors du telechargement du rapport')
     setOpenModalUpload(true)
     setTimeout(() => {

      setOpenModalUpload(false)

     },3000)
      
      console.log(error)}) 
    
                 : await RapportDataService.addRapports(data).then((res) => {
                  
                  
                  setIdRapport(res.id)
                  setDataSend(true)
                  console.log('envoyé')
                  setDataLoading(true)
                 setDocIsCreated(true)
                 setUrlFirebaseLoaded(false)
     setInfoUploadData('Le rapport a été enregistré avec succès')

     setUploadSuccess(true)
     setOpenModalUpload(true)


     setTimeout(() => {

      setOpenModalUpload(false)

     },3000)

                
              
        }).catch((error) =>{

     setDataLoading(true)
     setUploadSuccess(false)     
     setInfoUploadData('Une erreur est survenue lors du telechargement du rapport')
     setOpenModalUpload(true)
     setTimeout(() => {

      setOpenModalUpload(false)

     },3000)
          console.log(error)})
   

}


useEffect(() => {

urlFirebaseLoaded && test()

// eslint-disable-next-line react-hooks/exhaustive-deps
},[urlFirebaseLoaded])




// console.log(infoInter);
// console.log(dataInterPdf);
return(

    <div className="blocCreateRapport">

      <div className="sectionCreateRapport">
    <h1 className="titleMonRapport">Mon rapport </h1>
  
    
    <form onSubmit={submitInformationInter}> 
      <div className="section-info-inter">
        <label >
            Client : 
            <input type ="text" name="client" value={infoInter.informationIntervention.client} onChange={e => handleChangeInfoInter(e.target.value,e.target.name)}/>
        </label>
        <label>
            Nos références : 
            <input type="text" name="reference" value={infoInter.informationIntervention.reference} onChange={e => handleChangeInfoInter(e.target.value,e.target.name) }/>
        </label>
        <label>
            Nom copro : 
            <input type="text" name="copro" value={infoInter.informationIntervention.copro} onChange={e => handleChangeInfoInter(e.target.value,e.target.name) }/>
        </label>
        <label>
            Référence client : 
            <input type="text" name="vosReference" value={infoInter.informationIntervention.vosReference} onChange={e => handleChangeInfoInter(e.target.value,e.target.name) }/>
        </label>
        {/* <label>
            Contact : 
            <input type="text" name="contact" value={infoInter.informationIntervention.contact} onChange={e => handleChangeInfoInter(e.target.value,e.target.name)}/>
        </label> */}
        {/* <label>
            Nom du sinistré : 
            <input type="text" name="nomSinistre" value={infoInter.informationIntervention.nomSinistre} onChange={e => handleChangeInfoInter(e.target.value,e.target.name)}/>
        </label> */}
        {/* <label>
            Situation: 
            <input type="text" name="situation" value={infoInter.informationIntervention.situation} onChange={e => handleChangeInfoInter(e.target.value,e.target.name)}/>
        </label> */}
        <label>
            Lieu intervention : 
            <input type="text" name="lieuIntervention" value={infoInter.informationIntervention.lieuIntervention} onChange={e => handleChangeInfoInter(e.target.value,e.target.name)}/>
        </label>
        <label>
            Date intervention : 
            <input type="date" name="dateIntervention" value={infoInter.informationIntervention.dateIntervention} onChange={e => handleChangeInfoInter(e.target.value,e.target.name)}/>
        </label>
        <label>
            Date du rapport : 
            <input type="date" name="dateRapport" value={infoInter.informationIntervention.dateRapport} onChange={e => handleChangeInfoInter(e.target.value,e.target.name)}/>
        </label>
        <label>
            Intervenant : 
            <input type="text" name="intervenant" value={infoInter.informationIntervention.intervenant} onChange={e => handleChangeInfoInter(e.target.value,e.target.name)}/>
        </label>
        {/* <label>
            Type de bien : 
            <input type="text" name="typeDeBien" value={infoInter.informationIntervention.typeDeBien} onChange={e => handleChangeInfoInter(e.target.value,e.target.name)}/>
        </label> */}
        {/* <label>
            Etage : 
            <input type="text" name="etage" value={infoInter.informationIntervention.etage} onChange={e => handleChangeInfoInter(e.target.value,e.target.name)}/>
        </label> */}
           <label className="labelMoyenTechnique">
                 Rapport terminé :  
                 <input className="checkBoxMoyen" type="checkbox"  checked={infoInter.informationIntervention.rapportFini} onChange={() => handleChangeInfoInter(!infoInter.informationIntervention.rapportFini,"rapportFini")}/>
                 
                    </label>
           </div>
        <BodyRapport2 infoInter={infoInter} dataInter={dataInter} setDataInter={setDataInter} setContainFile={setContainFile} containFile={containFile}/>



         {/* <BodyRapport dataInter={dataInter} setDataInter={setDataInter}/> */}
         <input className="buttonRegistrer" type="submit" value={docIsCreated ? "Modifier"  :"Enregister"} onClick={e => console.log('hello')}/>
    </form>

    </div>
    {refIsNull && <ModalRef setRefIsNull={setRefIsNull}/>}
  
       <div className="link-pdf">
     <PDFDownloadLink document={<Rapport idRapport={idRapport} dataLoading={setDataLoading} dataSend={dataSend} dataInfoPdf={dataInfoPdf} dataInterPdf={dataInterPdf} />} fileName={`${infoInter.informationIntervention.client} ${infoInter.informationIntervention.reference} ${infoInter.informationIntervention.dateIntervention}`}>
      {({ blob, url, loading, error }) =>(
        loading ? 'Chargement du document' : 'Telecharger document!')

     }
    </PDFDownloadLink>
    </div> 
    

 {/* { <PDFViewer><Rapport idRapport={idRapport} dataLoading={setDataLoading} dataSend={dataSend} dataInfoPdf={dataInfoPdf} dataInterPdf={dataInterPdf} /></PDFViewer>  }  */}
    
    
    {!dataLoading && <Loader/> }
   {openModalUpload && <ModalUploadData uploadSuccess={uploadSuccess} infoUploadData={infoUploadData}/>}
    
    </div>
)




}


export default memo(MonRapport)