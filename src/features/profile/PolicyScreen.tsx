import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type PolicyKind = 'privacy' | 'terms';

const privacySections = [
  ['Introduction & statutory compliance', 'Shopicom Ghana Limited (“Shopicom”, “we”, “us” or “our”) is committed to protecting the privacy, confidentiality and integrity of personal data collected from buyers, vendors, riders and platform visitors. This Privacy Policy explains how we collect, process, store, disclose and safeguard personal data in compliance with Ghana’s Data Protection Act, 2012 (Act 843).'],
  ['Information we collect', 'Account and identity data may include your full legal name, phone number, email address, physical or residential address, delivery location and, where required for vendor or courier onboarding and KYC verification, Ghana Card or passport information. Commercial and financial data may include mobile-money numbers, bank details, payout records, order histories, vendor catalogues, inventory metrics and merchant credentials. Technical and usage data may include device identifiers, IP addresses, browser type, login sessions, timestamps, approximate location and API interactions.'],
  ['Purpose of processing', 'We process data to facilitate multi-vendor transactions, order placement, logistics and courier dispatch; process payments, vendor settlements, escrow releases and refunds; prevent fraud, unauthorised use, security vulnerabilities and criminal activity; and comply with statutory reporting, accounting and tax obligations under Ghanaian law.'],
  ['Data protection & confidentiality', 'Shopicom does not export, sell, rent, monetise or misuse customer data, vendor credentials, transaction histories or employee records for purposes outside official platform operations. Databases, server scripts, cloud infrastructure, API keys and repositories are protected with encrypted, access-controlled protocols. Developers, employees, contractors and co-founders are subject to contractual confidentiality and credential-handling obligations.'],
  ['Cookies & tracking technologies', 'Shopicom uses cookies, session tokens and tracking technologies to improve user experience, maintain uptime and support authentication security. Essential cookies support authentication, sessions, caching and security checks. Functional and analytics technologies may measure aggregate visits, API performance, UI interactions and system stability.'],
  ['Data retention & deletion', 'We retain personal and financial records only as long as necessary to operate the marketplace, resolve disputes, prevent fraud and comply with statutory audit periods. When an account is deleted, personal records are permanently erased or pseudonymised except where statutory retention rules apply.'],
  ['Your rights', 'Under Ghana’s Data Protection Act, you may request access to personal data we hold about you, correction of inaccurate or incomplete data, objection to direct marketing or unauthorised third-party transfers, and deletion of account data subject to operational and statutory exceptions.'],
  ['Contact & Privacy Officer', 'For data-access requests, enquiries or privacy complaints, contact the Data Protection Officer at Shopicom Ghana Limited. Website: https://shopicomltd.online  Email: privacy@shopicomltd.online  Address: Tamale, Ghana.'],
] as const;

const termsSections = [
  ['Acceptance of terms & governance', 'These Terms of Service constitute a legally binding agreement between Shopicom Ghana Limited and every individual or entity accessing or using the Shopicom multi-vendor mobile or web platform. Creating an account, transacting or listing products means you agree to these Terms.'],
  ['User accounts & registration', 'Users must provide accurate, verified legal identification, contact information and delivery details. Users are responsible for protecting passwords, two-factor authentication tokens and API credentials. Users must be at least 18 years old or have legally registered business authority to operate as an independent merchant on Shopicom.'],
  ['Multi-vendor marketplace operations', 'Vendors warrant that listed goods are authentic, non-counterfeit, fit for consumption or use and compliant with Ghanaian standards. Vendors agree to transparent commissions, payout schedules and withholding rules published by the Company. Merchants must fulfil orders within specified timelines, while couriers and riders must maintain service standards, emergency availability and transaction verification during transit.'],
  ['Intellectual property', 'All Shopicom software, source code, APIs, client code, server scripts, UI/UX architecture, database schemas, algorithms, documentation, logos, trademarks and copyrightable works belong exclusively to Shopicom Ghana Limited. Copying, decompiling, reverse engineering, modifying, licensing, embedding copyleft scripts into, or extracting proprietary source code is prohibited.'],
  ['Prohibited activities & termination', 'Shopicom may suspend, forfeit or terminate an account for cause, including fraudulent financial transactions, chargebacks, embezzlement, mobile-money manipulation, listing stolen, infringing, prohibited or illegal goods, introducing viruses or harmful code, scraping, unauthorised API injections, or materially breaching confidentiality, privacy or intellectual-property terms.'],
  ['Tax responsibilities', 'Each vendor, courier, contractor and user is individually responsible for reporting, filing and remitting applicable income taxes, VAT, levies and other statutory liabilities arising from commercial activities, sales, commissions or compensation under Ghanaian law.'],
  ['Limitation of liability', 'The platform is provided on an “as is” and “as available” basis without a warranty of uninterrupted uptime. Shopicom may seek injunctive relief for breaches or threatened breaches involving intellectual property, proprietary assets, database security or data protection.'],
  ['Force majeure', 'Neither party is liable for failure or delay caused by events beyond reasonable control, including natural disasters, war, civil unrest, severe national network or internet outages, or government restrictions.'],
  ['Governing law & disputes', 'These Terms are governed by the laws of the Republic of Ghana. Disputes should first be submitted to good-faith private mediation. If mediation fails within 30 days, the dispute will be referred to binding arbitration under Ghana’s Alternative Dispute Resolution Act.'],
  ['Modifications', 'Shopicom reserves the operational right, under the authority of its Chief Executive Officer and Managing Director, to update or supplement these Terms. Continued platform access after a published update constitutes acceptance of the revised Terms.'],
] as const;

export function PolicyScreen({ kind, onBack }: { kind: PolicyKind; onBack: () => void }) {
  const isPrivacy = kind === 'privacy';
  const sections = isPrivacy ? privacySections : termsSections;
  return <View style={styles.screen}>
    <View style={styles.header}><Pressable hitSlop={10} onPress={onBack}><Text style={styles.back}>‹</Text></Pressable><Text style={styles.headerTitle}>{isPrivacy ? 'Privacy Policy' : 'Terms of Service'}</Text></View>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.company}>Shopicom Ghana Limited</Text>
      <Text style={styles.meta}>{isPrivacy ? 'Privacy & Policies' : 'Terms of Use'} · Effective date: August 2026</Text>
      {sections.map(([title, body]) => <View key={title} style={styles.section}><Text style={styles.title}>{title}</Text><Text style={styles.body}>{body}</Text></View>)}
    </ScrollView>
  </View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF8F5' }, header: { height: 64, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F45100', paddingHorizontal: 16 }, back: { color: '#FFF', fontSize: 38, lineHeight: 40, marginRight: 12 }, headerTitle: { color: '#FFF', fontSize: 20, fontWeight: '800' }, content: { padding: 18, paddingBottom: 40 }, company: { color: '#222', fontSize: 22, fontWeight: '800' }, meta: { color: '#777', fontSize: 12, marginTop: 6, marginBottom: 22 }, section: { marginBottom: 20 }, title: { color: '#F45100', fontSize: 16, fontWeight: '800', marginBottom: 6 }, body: { color: '#333', fontSize: 14, lineHeight: 22 },
});
