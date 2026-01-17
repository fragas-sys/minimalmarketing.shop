import React from 'react';
import { Container } from '@/components/ui/Container';
import { Product } from '@/types';

interface BenefitsSectionProps {
  benefits?: string[];
}

export function BenefitsSection({ benefits }: BenefitsSectionProps) {
  if (!benefits || benefits.length === 0) return null;

  return (
    <>
      {benefits.map((benefit, index) => (
        <section
          key={index}
          className={`min-h-screen flex items-center ${
            index % 2 === 0 ? 'bg-white' : 'bg-black text-white'
          }`}
        >
          <Container>
            <div className="max-w-4xl mx-auto text-center py-20">
              <div className={`text-7xl md:text-9xl font-bold mb-8 ${
                index % 2 === 0 ? 'text-black' : 'text-white'
              }`}>
                {benefit.split(' ').slice(0, 2).join(' ')}
              </div>
              <p className={`text-2xl md:text-3xl font-light ${
                index % 2 === 0 ? 'text-gray-600' : 'text-white/80'
              }`}>
                {benefit}
              </p>
            </div>
          </Container>
        </section>
      ))}
    </>
  );
}

interface DeliverablesSectionProps {
  deliverables?: Product['deliverables'];
}

export function DeliverablesSection({ deliverables }: DeliverablesSectionProps) {
  if (!deliverables || deliverables.length === 0) return null;

  return (
    <section className="py-32 bg-white">
      <Container>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-20 text-center">
            O que você recebe
          </h2>

          <div className="space-y-16">
            {deliverables.map((deliverable, index) => (
              <div
                key={deliverable.id}
                className="flex items-start gap-8 pb-16 border-b border-gray-100 last:border-0"
              >
                <div className="text-6xl font-bold text-gray-200 w-20 flex-shrink-0">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold mb-4">{deliverable.name}</h3>
                  {deliverable.description && (
                    <p className="text-xl text-gray-600 mb-2">{deliverable.description}</p>
                  )}
                  {deliverable.fileSize && (
                    <p className="text-sm text-gray-400">{deliverable.fileSize}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

interface HighlightsSectionProps {
  highlights?: string[];
}

export function HighlightsSection({ highlights }: HighlightsSectionProps) {
  if (!highlights || highlights.length === 0) return null;

  return (
    <section className="py-32 bg-accent">
      <Container>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            {highlights.map((highlight, index) => (
              <div key={index} className="space-y-4">
                <div className="text-5xl font-bold">
                  {highlight.split(' ')[0]}
                </div>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {highlight}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

interface FAQSectionProps {
  faqs?: Array<{ question: string; answer: string }>;
}

export function FAQSection({ faqs }: FAQSectionProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-32 bg-white">
      <Container>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-16">
            Perguntas frequentes
          </h2>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="pb-8 border-b border-gray-200 last:border-0">
                <h3 className="text-2xl font-semibold mb-4">{faq.question}</h3>
                <p className="text-lg text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
