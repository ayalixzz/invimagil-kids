"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#F6F9FB",
  },
  borderOuter: {
    border: "8pt double #A2D0DD",
    borderRadius: 15,
    padding: 15,
    height: "100%",
  },
  borderInner: {
    border: "2pt solid #0091B3",
    borderRadius: 8,
    padding: 30,
    height: "100%",
    position: "relative",
  },
  logoPlaceholder: {
    alignSelf: "center",
    width: 170,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#0091B3",
    marginBottom: 15,
  },
  title: {
    fontFamily: "Helvetica-Bold",
    fontSize: 24,
    color: "#002F6C",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    color: "#D80215",
    textAlign: "center",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 20,
  },
  descText: {
    fontFamily: "Helvetica",
    fontSize: 12,
    color: "#445E70",
    textAlign: "center",
    lineHeight: 1.5,
    marginBottom: 15,
  },
  highlightBox: {
    backgroundColor: "#EAF7FB",
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
    alignSelf: "center",
    width: "80%",
  },
  highlightText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
    color: "#002F6C",
    textAlign: "center",
  },
  regNumber: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: "#0091B3",
    textAlign: "center",
    marginTop: 5,
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  signatureBlock: {
    width: 150,
    alignItems: "center",
  },
  sigLine: {
    borderTop: "1pt solid #445E70",
    width: "100%",
    marginTop: 20,
    paddingTop: 5,
  },
  sigText: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#445E70",
    textAlign: "center",
  },
  sigName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: "#002F6C",
    textAlign: "center",
  },
  seal: {
    width: 70,
    height: 70,
    borderRadius: 35,
    border: "2pt dashed #FFC800",
    backgroundColor: "#FFF9C4",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  sealText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: "#002F6C",
    textAlign: "center",
  },
});

interface CertificatePDFProps {
  companyName: string;
  productName: string;
  registrationNumber: string;
  score: number;
  level: string;
  date: string;
}

export default function CertificatePDF({
  companyName,
  productName,
  registrationNumber,
  score,
  level,
  date,
}: CertificatePDFProps) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.borderOuter}>
          <View style={styles.borderInner}>
            <View style={styles.logoPlaceholder} />
            <Text style={styles.title}>REGISTRO SANITARIO MÁGICO</Text>
            <Text style={styles.subtitle}>Invimágil Kids Colombia</Text>

            <Text style={styles.descText}>
              El presente documento certifica que la empresa de alimentos imaginaria
            </Text>

            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 18, color: "#0091B3", textAlign: "center", marginBottom: 5 }}>
              {companyName}
            </Text>

            <Text style={styles.descText}>
              ha formulado exitosamente su producto estrella y superado las pruebas de higiene y calidad.
            </Text>

            <View style={styles.highlightBox}>
              <Text style={styles.highlightText}>{productName}</Text>
              <Text style={styles.regNumber}>REGISTRO No. {registrationNumber}</Text>
            </View>

            <Text style={[styles.descText, { fontSize: 10, marginTop: 5 }]}>
              Puntaje obtenido: {score} puntos | Nivel alcanzado: {level}
            </Text>

            <View style={styles.grid}>
              <View style={styles.seal}>
                <Text style={styles.sealText}>100%</Text>
                <Text style={[styles.sealText, { fontSize: 6 }]}>CALIDAD Y BPM</Text>
              </View>

              <View style={styles.signatureBlock}>
                <Text style={{ fontFamily: "Courier-Oblique", fontSize: 14, color: "#002F6C", marginBottom: -10 }}>
                  InviBot
                </Text>
                <View style={styles.sigLine}>
                  <Text style={styles.sigName}>InviBot</Text>
                  <Text style={styles.sigText}>Asistente Virtual de Registros</Text>
                </View>
              </View>

              <View style={styles.signatureBlock}>
                <Text style={{ fontFamily: "Helvetica", fontSize: 11, color: "#002F6C", marginTop: 10 }}>
                  {date}
                </Text>
                <View style={styles.sigLine}>
                  <Text style={styles.sigName}>Fecha de Emisión</Text>
                  <Text style={styles.sigText}>Válido para jugar y aprender</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
