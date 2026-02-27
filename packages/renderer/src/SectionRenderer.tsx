import type { Section } from '@noro/types/blueprint';
import { SectionType } from '@noro/types/blueprint';
import { HeroSection } from './sections/HeroSection';
import { FeaturesSection } from './sections/FeaturesSection';
import { ContentSection } from './sections/ContentSection';
import { CtaSection } from './sections/CtaSection';
import { ContactSection } from './sections/ContactSection';
import { FooterSection } from './sections/FooterSection';

interface SectionRendererProps {
    section: Section;
    primaryColor: string;
}

export function SectionRenderer({ section, primaryColor }: SectionRendererProps) {
    if (!section.visible) {
        return null;
    }

    switch (section.type) {
        case SectionType.HERO:
            return <HeroSection config={section.config} primaryColor={primaryColor} />;

        case SectionType.FEATURES:
            return <FeaturesSection config={section.config} primaryColor={primaryColor} />;

        case SectionType.CONTENT:
            return <ContentSection config={section.config} />;

        case SectionType.CTA:
            return <CtaSection config={section.config} primaryColor={primaryColor} />;

        case SectionType.CONTACT:
            return <ContactSection config={section.config} primaryColor={primaryColor} />;

        case SectionType.FOOTER:
            return <FooterSection config={section.config} primaryColor={primaryColor} />;

        case SectionType.GALLERY:
        case SectionType.PRICING:
        case SectionType.TESTIMONIALS:
        case SectionType.FAQ:
            return null;

        default:
            return null;
    }
}
