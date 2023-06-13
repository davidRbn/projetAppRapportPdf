import { StyleSheet, Text, View } from "@react-pdf/renderer";
import React from "react";
import globalColor from "../globalStyles/globalStyles";




const PageThreePdf = ({dataInterPdf}) => {


    const stylesPageTwoPdf = StyleSheet.create({

        blocArray:{

            margin:'auto',
            

        },
         ligneArray:{

            display:'flex',
            flexDirection:'row',
            margin:'auto'
            // width:'510px'


         },
         ligneArray2:{

            display:'flex',
            flexDirection:'row',
            backgroundColor:'#7FCA8B',
            opacity:'0.4',
            width:'510px'


         },
           headArray1:{
             
            color:`${globalColor.titleColor}`,
            fontSize:`${globalColor.textSize}`,
            padding:'5px 5px',
            border: `1px solid ${globalColor.titleColor}`,
            width:'270px',
            textAlign:'center'


           },
          headArray:{
             color:`${globalColor.titleColor}`,
            fontSize:`${globalColor.textSize}`,
            padding:'5px 5px',
            // border: `1px solid ${globalColor.titleColor}`,
            width:'120px',
            textAlign:'center',

          },
          textAlignMoyen1 : {

            fontSize:`${globalColor.textSize}`,
            width:'200px',
            textAlign:'center',
            padding:'2px 5px',
            borderBottom: `2px solid ${globalColor.titleColor}`,
            borderRight: `2px solid ${globalColor.titleColor}`,

            

          },
          textAlignMoyen : {

            fontSize:`${globalColor.textSize}`,
            textAlign:'center',
            padding:'2px 5px',
            width:'30px',
            borderBottom: `2px solid ${globalColor.titleColor}`,
            opacity:'1'
            


          },

        titleDataInter:{
            color:`${globalColor.titleColor}`,
            margin:'10px',
            textAlign:'center'
    
        },
        description : {

            margin: '5px 20px',
            fontSize:`${globalColor.textSize}`,
            lineHeight:`${globalColor.lineHeigth}`,
            
        }
    
    
    })


         /* {dataInterPdf.filter(data => data.section === 'vueGlobale').map((data,indexData )=> 
    
            <View key={indexData}>

            {data.image.map((image,index)=> 
                
                <View key={index} style={stylesLandingPage.blocImageLeg}>
                     <Text style={stylesLandingPage.textVueGlobale}>{data.titre}</Text>
                        <Image style={stylesLandingPage.imageVueGlobale} source={{uri : image.url,method: "GET"}}/>

                </View>
                
                
                )}
             
             
            
            
            </View>
            
            )} */





return (

<>
  {dataInterPdf.filter(data => data.section === 'investigations'|| data.section === "moyenTechnique").map((data,indexData )=> 
    
   { if(data.section === 'moyenTechnique'){

return ( 
<View key={indexData}>
<Text style={stylesPageTwoPdf.titleDataInter}>{data.titre}</Text>
    
    <View>
        {/* <Text style={stylesPageTwoPdf.titleDataInter}>Investigations : </Text> */}
          <Text  style={stylesPageTwoPdf.description}>Lors de notre intervention, nous avons mis en œuvre les moyens techniques suivants :</Text>
    </View>

     <View  style={stylesPageTwoPdf.blocArray}>

     {/* <View style={stylesPageTwoPdf.ligneArray}>
          <Text style={stylesPageTwoPdf.headArray1} >MOYENS TECHNIQUES DISPONIBLES</Text>
          <Text style={stylesPageTwoPdf.headArray}>MIS EN OEUVRE</Text>  
          <Text style={stylesPageTwoPdf.headArray}>CONCLUANT</Text>  
     </View> 
     */}
         {data.moyenTechnique.map((moyen,indexMoyen) => 
            
            
            <View key={indexMoyen} style={stylesPageTwoPdf.ligneArray } >

                 <Text style={stylesPageTwoPdf.textAlignMoyen1}>{moyen.materielUtilise}</Text>
                 <Text style={stylesPageTwoPdf.textAlignMoyen}>{moyen.isUse ? 'X' : ''}</Text>
                 {/* <Text style={stylesPageTwoPdf.textAlignMoyen}></Text> */}


            </View>
                    
            
            )} 
</View>
 </View>    )     
      

   }else {
       
   return (<View key={indexData}>
    <Text style={stylesPageTwoPdf.titleDataInter}>{data.titre}</Text>
    <Text style={stylesPageTwoPdf.description}>{data.description}</Text>
  
  </View>)


   }
   
   
   }
    
    
    
    )}

</>

)




}


export default PageThreePdf