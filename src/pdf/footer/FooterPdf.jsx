import React from "react";
import {Text, View, StyleSheet} from '@react-pdf/renderer';
import globalColor from "../globalStyles/globalStyles";




const FooterPdf = () => {

    const stylesFooter = StyleSheet.create({
        
        sectionFooter:{

            width:'100%',
            height:'50px',
            position :'absolute',
            bottom:'3px',
            textAlign:'center',
            marginTop:'20px',
            
        },
        textFooter:{

            fontSize:`${globalColor.textSize}`,
            padding:'3px',
            color:'grey'
        }

    })



    return(

        
        <View fixed style={stylesFooter.sectionFooter}>
            <Text style={stylesFooter.textFooter}>A.D.Eau Expertise – SAS au capital de 3 000.00 € - 78 rue Charles Kaddouz</Text>
                    <Text style={stylesFooter.textFooter}>13012 MARSEILLE</Text>
                        <Text style={stylesFooter.textFooter}>Tél : 06 23 77 78 01 – SIRET 95300466000015135 – R.C.S. Marseille</Text>
                    {/* <Text style={stylesFooter.textFooter}>Groupe MANAGEMENT PROJECTS</Text> */}
        </View>
        
        
    )
}

export default FooterPdf