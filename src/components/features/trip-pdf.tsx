"use client"

import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer'
import { TripData } from './trip-itinerary'

// Register fonts if needed, but Helvetica is standard
// Using standard fonts ensures reliability
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#0a0a0a', // Dark background
        color: '#ffffff',
        padding: 40,
        fontFamily: 'Helvetica',
    },
    // Header / Cover
    headerSection: {
        marginBottom: 40,
        borderBottom: '1px solid #333',
        paddingBottom: 20,
    },
    badge: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        color: '#34d399',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        alignSelf: 'flex-start',
        fontSize: 10,
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#ffffff',
        // fontFamily: 'Helvetica-Bold', // Standard font
    },
    subtitle: {
        fontSize: 12,
        color: '#a1a1aa',
        marginBottom: 20,
    },
    // Day Section
    dayContainer: {
        marginBottom: 25,
        paddingLeft: 15,
        borderLeft: '2px solid #333',
    },
    dayHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    dayCircle: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10b981',
        position: 'absolute',
        left: -20,
        top: 6,
    },
    dayTitle: {
        fontSize: 18,
        color: '#10b981',
        marginBottom: 4,
        // fontFamily: 'Helvetica-Bold',
    },
    dayTheme: {
        fontSize: 12,
        color: '#71717a',
        fontStyle: 'italic',
    },
    // Activities
    activityGrid: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 10,
    },
    activityCard: {
        flex: 1,
        backgroundColor: '#18181b', // zinc-900
        padding: 10,
        borderRadius: 8,
    },
    timeLabel: {
        fontSize: 8,
        color: '#34d399', // emerald-400
        textTransform: 'uppercase',
        marginBottom: 5,
        letterSpacing: 1,
    },
    activityText: {
        fontSize: 10,
        lineHeight: 1.4,
        color: '#e4e4e7', // zinc-200
    },
    // Stay
    staySection: {
        marginTop: 10,
        padding: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    stayLabel: {
        fontSize: 8,
        color: '#71717a',
        textTransform: 'uppercase',
        marginRight: 5,
        letterSpacing: 1,
    },
    stayText: {
        fontSize: 10,
        color: '#ffffff',
        flex: 1,
    },
    // Footer
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        borderTop: '1px solid #333',
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footerText: {
        fontSize: 8,
        color: '#52525b',
    },
    brandText: {
        fontSize: 8,
        color: '#10b981',
        textTransform: 'uppercase',
        letterSpacing: 1,
    }
});

interface TripPdfProps {
    data: TripData
}

export const TripPdfDocument = ({ data }: TripPdfProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.headerSection}>
                <View style={styles.badge}>
                    <Text>AI Curated Trip</Text>
                </View>
                <Text style={styles.title}>{data.trip_name}</Text>
                <Text style={styles.subtitle}>
                    Prepared exclusively by SafarAI • {data.days.length} Day Experience
                </Text>
            </View>

            {/* Content */}
            {data.days.map((day, index) => (
                <View key={day.day} style={styles.dayContainer} wrap={false}>
                    <View style={styles.dayCircle} />
                    <View style={styles.dayHeader}>
                        <Text style={styles.dayTitle}>Day {day.day}</Text>
                        <Text style={{ ...styles.dayTheme, marginLeft: 10 }}>— {day.theme}</Text>
                    </View>

                    <View style={styles.activityGrid}>
                        <View style={styles.activityCard}>
                            <Text style={styles.timeLabel}>Morning</Text>
                            <Text style={styles.activityText}>{day.morning}</Text>
                        </View>
                        <View style={styles.activityCard}>
                            <Text style={styles.timeLabel}>Afternoon</Text>
                            <Text style={styles.activityText}>{day.afternoon}</Text>
                        </View>
                        <View style={styles.activityCard}>
                            <Text style={styles.timeLabel}>Evening</Text>
                            <Text style={styles.activityText}>{day.evening}</Text>
                        </View>
                    </View>

                    <View style={styles.staySection}>
                        <Text style={styles.stayLabel}>Accommodation:</Text>
                        <Text style={styles.stayText}>{day.stay}</Text>
                    </View>
                </View>
            ))}

            {/* Footer */}
            <View style={styles.footer} fixed>
                <Text style={styles.footerText}>© 2026 SafarAI Autonomous Travel</Text>
                <Text style={styles.brandText}>Generated by SafarAI</Text>
            </View>
        </Page>
    </Document>
)
