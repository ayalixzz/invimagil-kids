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
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
  },
  title: {
    fontFamily: "Helvetica-Bold",
    fontSize: 22,
    color: "#002F6C",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: "#D80215",
    textAlign: "center",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 15,
  },
  descText: {
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#445E70",
    textAlign: "center",
    lineHeight: 1.5,
    marginBottom: 10,
  },
  companyName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 18,
    color: "#0091B3",
    textAlign: "center",
    marginBottom: 5,
  },
  highlightBox: {
    backgroundColor: "#EAF7FB",
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
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
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 8,
  },
  detailBox: {
    flex: 1,
    backgroundColor: "#F0F8FF",
    borderRadius: 6,
    padding: 8,
    alignItems: "center",
  },
  detailLabel: {
    fontFamily: "Helvetica",
    fontSize: 7,
    color: "#445E70",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
  },
  detailValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: "#002F6C",
    textAlign: "center",
  },
  medalsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 10,
    marginBottom: 5,
  },
  medalCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  medalText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 6,
    color: "#FFFFFF",
    textAlign: "center",
  },
  medalEmoji: {
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
    textAlign: "center",
  },
  scoreText: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#445E70",
    textAlign: "center",
    marginTop: 5,
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    alignItems: "flex-end",
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
    fontSize: 8,
    color: "#445E70",
    textAlign: "center",
  },
  sigName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: "#002F6C",
    textAlign: "center",
  },
  seal: {
    width: 65,
    height: 65,
    borderRadius: 33,
    border: "2pt dashed #FFC800",
    backgroundColor: "#FFF9C4",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  sealText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: "#002F6C",
    textAlign: "center",
  },
  footer: {
    fontFamily: "Helvetica",
    fontSize: 7,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 10,
  },
});

interface CertificatePDFProps {
  companyName: string;
  productName: string;
  registrationNumber: string;
  score: number;
  level: string;
  date: string;
  riskLevel?: string;
  shelfLifeDays?: string;
  city?: string;
  packaging?: string;
  medalsEarned?: string[];
}

export default function CertificatePDF({
  companyName,
  productName,
  registrationNumber,
  score,
  level,
  date,
  riskLevel = "bajo",
  shelfLifeDays = "",
  city = "",
  packaging = "",
  medalsEarned = [],
}: CertificatePDFProps) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.borderOuter}>
          <View style={styles.borderInner}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>INVIMAGIL KIDS</Text>
            </View>
            <Text style={styles.title}>REGISTRO SANITARIO MÁGICO</Text>
            <Text style={styles.subtitle}>Invimágil Kids Colombia</Text>

            <Text style={styles.descText}>
              El presente documento certifica que la empresa de alimentos imaginaria
            </Text>

            <Text style={styles.companyName}>
              {companyName}
            </Text>

            <Text style={styles.descText}>
              ha formulado exitosamente su producto estrella y superado las pruebas de higiene,
              Buenas Prácticas de Manufactura y calidad alimentaria.
            </Text>

            <View style={styles.highlightBox}>
              <Text style={styles.highlightText}>{productName}</Text>
              <Text style={styles.regNumber}>REGISTRO No. {registrationNumber}</Text>
            </View>

            {/* Details row */}
            <View style={styles.detailsRow}>
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>Riesgo</Text>
                <Text style={styles.detailValue}>{riskLevel.toUpperCase()}</Text>
              </View>
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>Vida útil</Text>
                <Text style={styles.detailValue}>{shelfLifeDays || "Definida"}</Text>
              </View>
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>Empaque</Text>
                <Text style={styles.detailValue}>{packaging || "Definido"}</Text>
              </View>
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>Ciudad</Text>
                <Text style={styles.detailValue}>{city || "Colombia"}</Text>
              </View>
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>Validez</Text>
                <Text style={styles.detailValue}>5 años</Text>
              </View>
            </View>

            {/* Medals */}
            <View style={styles.medalsRow}>
              <View style={[styles.medalCircle, { backgroundColor: medalsEarned.includes("higiene") ? "#8BC53F" : "#D1D5DB" }]}>
                <Text style={styles.medalEmoji}>✨</Text>
                <Text style={styles.medalText}>Higiene</Text>
              </View>
              <View style={[styles.medalCircle, { backgroundColor: medalsEarned.includes("seguridad") ? "#0091B3" : "#D1D5DB" }]}>
                <Text style={styles.medalEmoji}>🛡</Text>
                <Text style={styles.medalText}>Seguridad</Text>
              </View>
              <View style={[styles.medalCircle, { backgroundColor: medalsEarned.includes("calidad") ? "#FFC800" : "#D1D5DB" }]}>
                <Text style={styles.medalEmoji}>❤</Text>
                <Text style={styles.medalText}>Calidad</Text>
              </View>
            </View>

            <Text style={styles.scoreText}>
              Puntaje: {score} puntos | Nivel: {level}
            </Text>

            <View style={styles.grid}>
              <View style={styles.seal}>
                <Text style={styles.sealText}>100%</Text>
                <Text style={[styles.sealText, { fontSize: 5 }]}>CALIDAD Y BPM</Text>
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
                <Text style={{ fontFamily: "Helvetica", fontSize: 10, color: "#002F6C", marginTop: 10 }}>
                  {date}
                </Text>
                <View style={styles.sigLine}>
                  <Text style={styles.sigName}>Fecha de Emisión</Text>
                  <Text style={styles.sigText}>Válido para jugar y aprender</Text>
                </View>
              </View>
            </View>

            <Text style={styles.footer}>
              Resolución aplicada: 719 de 2015. Certificado educativo y simulado para aprender jugando.
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
