import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { PariwaraFormData, AIRecommendation } from '../types';

interface Props {
  formData: PariwaraFormData;
  rec:      AIRecommendation;
  mediaNames: string[];
  genNames:   string[];
}

// The default Helvetica font only supports WinAnsiEncoding (~Windows-1252) —
// emoji and other pictographs in AI-generated copy render as garbled bytes
// (e.g. "=€") instead of being skipped, so strip them before they hit <Text>.
const EMOJI_RE = /[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}\u{2300}-\u{23FF}️‍]/gu;
const clean = (text: string) => text.replace(EMOJI_RE, '').replace(/[ \t]{2,}/g, ' ').trim();

// Plain hex values (no CSS vars / color-mix — this renders outside the DOM
// entirely, so it doesn't need to match the live theme, just look good on paper).
const C = {
  ink:        '#2A2521',
  ink2:       '#45403A',
  muted:      '#756B60',
  border:     '#E4DED4',
  card:       '#FCFAF7',
  stone:      '#F1EDE7',
  sage:       '#4A6350',
  sageLight:  '#EAF1EB',
  sageBtn:    '#5A7F60',
  amber:      '#7C5E3B',
  amberLight: '#F6EFE2',
};

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 10.5,
    fontFamily: 'Helvetica',
    color: C.ink,
  },
  hero: {
    backgroundColor: C.sageBtn,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  heroEyebrow: {
    fontSize: 8.5,
    color: '#E8F0E9',
    letterSpacing: 1,
    marginBottom: 3,
  },
  heroTitle: {
    fontSize: 15,
    color: '#FFFFFF',
    fontFamily: 'Helvetica-Bold',
  },
  card: {
    backgroundColor: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  paramRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  paramTag: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    backgroundColor: C.stone,
    color: C.ink2,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 9,
  },
  sectionHeader: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: C.ink2,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottom: `1px solid ${C.border}`,
  },
  platformItem: {
    backgroundColor: C.stone,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  platformTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  platformIndex: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: C.sageBtn,
    color: '#FFFFFF',
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    paddingTop: 3,
  },
  platformTitle: {
    fontSize: 10.5,
    fontFamily: 'Helvetica-Bold',
  },
  platformDesc: {
    fontSize: 9.5,
    color: C.ink2,
    lineHeight: 1.5,
  },
  platformReasoning: {
    fontSize: 9,
    color: C.sage,
    fontStyle: 'italic',
    marginTop: 6,
    paddingTop: 6,
    borderTop: `1px solid ${C.border}`,
  },
  captionBlock: {
    marginBottom: 12,
  },
  captionLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: C.amber,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  captionExample: {
    backgroundColor: C.stone,
    borderLeft: '3px solid #C6A166',
    borderRadius: 6,
    padding: 8,
    fontSize: 9.5,
    fontStyle: 'italic',
    color: C.ink2,
    lineHeight: 1.5,
    marginBottom: 5,
  },
  captionTip: {
    fontSize: 8.8,
    color: C.muted,
    lineHeight: 1.4,
  },
  marketplaceTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 3,
  },
  marketplaceDetails: {
    fontSize: 9.3,
    color: C.muted,
    lineHeight: 1.5,
    marginBottom: 6,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 4,
    gap: 6,
  },
  bulletDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.sage,
    marginTop: 3.5,
  },
  bulletText: {
    fontSize: 9.3,
    color: C.ink2,
    flex: 1,
    lineHeight: 1.4,
  },
  quickWinCard: {
    backgroundColor: C.sageLight,
    border: `1px solid ${C.sage}`,
    borderRadius: 10,
    padding: 12,
  },
  quickWinRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    marginBottom: 6,
    gap: 8,
  },
  quickWinIndex: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: C.sageBtn,
    color: '#FFFFFF',
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    paddingTop: 3,
  },
  quickWinText: {
    fontSize: 9.3,
    color: C.ink2,
    flex: 1,
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 32,
    right: 32,
    textAlign: 'center',
    fontSize: 8,
    color: C.muted,
    letterSpacing: 0.5,
  },
});

export default function PariwaraPDFDocument({ formData, rec, mediaNames, genNames }: Props) {
  return (
    <Document title={`Laporan Pariwara - ${formData.productName}`}>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.hero}>
          <Text style={styles.heroEyebrow}>ANALISIS SELESAI</Text>
          <Text style={styles.heroTitle}>Strategi Iklan untuk "{clean(formData.productName)}"</Text>
        </View>

        <View style={styles.card}>
          <Text style={[styles.sectionHeader, { borderBottom: 'none', paddingBottom: 0, marginBottom: 8 }]}>
            Parameter Analisis
          </Text>
          <View style={styles.paramRow}>
            <Text style={styles.paramTag}>Produk: {clean(formData.productName)}</Text>
            {mediaNames.map((m, i) => (
              <Text key={`m-${i}`} style={styles.paramTag}>Media: {clean(m)}</Text>
            ))}
            {genNames.map((g, i) => (
              <Text key={`g-${i}`} style={styles.paramTag}>Target: {clean(g)}</Text>
            ))}
            {formData.locations.map((l, i) => (
              <Text key={`l-${i}`} style={styles.paramTag}>Lokasi: {clean(l)}</Text>
            ))}
          </View>
        </View>

        <View style={styles.card} wrap={false}>
          <Text style={styles.sectionHeader}>I. Platform & Saluran Iklan Terbaik</Text>
          {rec.recommendedPlatforms?.map((p, i) => (
            <View key={i} style={styles.platformItem} wrap={false}>
              <View style={styles.platformTitleRow}>
                <Text style={styles.platformIndex}>{i + 1}</Text>
                <Text style={styles.platformTitle}>{clean(p.name)}</Text>
              </View>
              <Text style={styles.platformDesc}>{clean(p.description)}</Text>
              {p.reasoning && <Text style={styles.platformReasoning}>{clean(p.reasoning)}</Text>}
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionHeader}>II. Contoh Caption Iklan</Text>
          {rec.copywritingStyles?.map((c, i) => (
            <View key={i} style={styles.captionBlock} wrap={false}>
              <Text style={styles.captionLabel}>{clean(c.title)}</Text>
              <Text style={styles.captionExample}>{clean(c.example)}</Text>
              <Text style={styles.captionTip}>Tips: {clean(c.tips)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionHeader}>III. Strategi Kelola Marketplace</Text>
          {rec.marketplaceStrategies?.map((s, i) => (
            <View key={i} style={{ marginBottom: 10 }} wrap={false}>
              <Text style={styles.marketplaceTitle}>{clean(s.title)}</Text>
              <Text style={styles.marketplaceDetails}>{clean(s.details)}</Text>
              {s.actionItems.map((a, j) => (
                <View key={j} style={styles.bulletRow}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletText}>{clean(a)}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {(rec.quickWins?.length ?? 0) > 0 && (
          <View style={styles.quickWinCard} wrap={false}>
            <Text style={[styles.sectionHeader, { borderBottom: 'none', color: C.sage }]}>
              IV. Aksi Cepat — Mulai Hari Ini
            </Text>
            {rec.quickWins.map((w, i) => (
              <View key={i} style={styles.quickWinRow} wrap={false}>
                <Text style={styles.quickWinIndex}>{i + 1}</Text>
                <Text style={styles.quickWinText}>{clean(w)}</Text>
              </View>
            ))}
          </View>
        )}

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) => `Pariwara oleh Affandy Murad · Halaman ${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
}
