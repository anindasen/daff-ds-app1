import { useState } from 'react'
import currency from 'currency.js'
import { Box } from '@ag.ds-next/react/box'
import { Stack } from '@ag.ds-next/react/stack'
import { PageContent } from '@ag.ds-next/react/content'
import { H1, H2 } from '@ag.ds-next/react/heading'
import { Text } from '@ag.ds-next/react/text'
import { TextInput } from '@ag.ds-next/react/text-input'
import { Textarea } from '@ag.ds-next/react/textarea'
import { Select } from '@ag.ds-next/react/select'
import { Button, ButtonGroup } from '@ag.ds-next/react/button'
import { FormStack } from '@ag.ds-next/react/form-stack'
import { PageAlert } from '@ag.ds-next/react/page-alert'
import { Card, CardInner } from '@ag.ds-next/react/card'

interface FormData {
  organizationName: string
  contactName: string
  email: string
  phone: string
  equipmentType: string
  equipmentDescription: string
  manufacturer: string
  modelNumber: string
  serialNumber: string
  quantity: string
  destinationCountry: string
  intendedUse: string
  exportDate: string
  exportValue: string
  exportCurrency: string
}

// Exchange rates to AUD (approximate rates for demonstration)
const EXCHANGE_RATES: Record<string, number> = {
  AUD: 1,
  USD: 1.55,
  EUR: 1.68,
  GBP: 1.98,
  JPY: 0.0104,
  CNY: 0.214,
  INR: 0.0185,
  SGD: 1.14,
  NZD: 0.93,
  KRW: 0.00115,
  THB: 0.045,
  MYR: 0.345,
  IDR: 0.000096,
  VND: 0.000061,
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    organizationName: '',
    contactName: '',
    email: '',
    phone: '',
    equipmentType: '',
    equipmentDescription: '',
    manufacturer: '',
    modelNumber: '',
    serialNumber: '',
    quantity: '1',
    destinationCountry: '',
    intendedUse: '',
    exportDate: '',
    exportValue: '',
    exportCurrency: ''
  })

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [convertedAUD, setConvertedAUD] = useState<string | null>(null)

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (!formData.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required'
    }
    if (!formData.contactName.trim()) {
      newErrors.contactName = 'Contact name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    if (!formData.equipmentType) {
      newErrors.equipmentType = 'Equipment type is required'
    }
    if (!formData.equipmentDescription.trim()) {
      newErrors.equipmentDescription = 'Equipment description is required'
    }
    if (!formData.manufacturer.trim()) {
      newErrors.manufacturer = 'Manufacturer is required'
    }
    if (!formData.modelNumber.trim()) {
      newErrors.modelNumber = 'Model number is required'
    }
    if (!formData.destinationCountry) {
      newErrors.destinationCountry = 'Destination country is required'
    }
    if (!formData.intendedUse.trim()) {
      newErrors.intendedUse = 'Intended use is required'
    }
    if (!formData.exportDate) {
      newErrors.exportDate = 'Expected export date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      console.log('Form submitted:', formData)
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleReset = () => {
    setFormData({
      organizationName: '',
      contactName: '',
      email: '',
      phone: '',
      equipmentType: '',
      equipmentDescription: '',
      manufacturer: '',
      modelNumber: '',
      serialNumber: '',
      quantity: '1',
      destinationCountry: '',
      intendedUse: '',
      exportDate: '',
      exportValue: '',
      exportCurrency: ''
    })
    setErrors({})
    setSubmitted(false)
    setConvertedAUD(null)
  }

  const handleConvertToAUD = () => {
    if (!formData.exportValue || !formData.exportCurrency) {
      return
    }

    const value = parseFloat(formData.exportValue)
    if (isNaN(value)) {
      return
    }

    const rate = EXCHANGE_RATES[formData.exportCurrency]
    if (!rate) {
      return
    }

    const audValue = currency(value).multiply(rate)
    setConvertedAUD(audValue.format())
  }

  return (
    <PageContent>
      <Stack gap={2}>
        <Box paddingY={2}>
          <H1>Export Permit Application</H1>
          <Text as="p" fontSize="md" color="muted">
            Request an export permit for specialized electronic equipment
          </Text>
        </Box>

        {submitted && (
          <PageAlert tone="success" title="Application submitted successfully">
            <Text as="p">
              Your export permit application has been received. Reference number: EP-{Date.now().toString().slice(-8)}
            </Text>
            <Text as="p">
              We will review your application and contact you at {formData.email} within 5-10 business days.
            </Text>
          </PageAlert>
        )}

        <form onSubmit={handleSubmit}>
          <FormStack>
            <H2>Applicant Information</H2>

            <TextInput
              label="Organization Name"
              required
              value={formData.organizationName}
              onChange={(e) => handleChange('organizationName', e.target.value)}
              invalid={!!errors.organizationName}
              message={errors.organizationName}
              maxWidth="xl"
            />

            <TextInput
              label="Contact Name"
              required
              value={formData.contactName}
              onChange={(e) => handleChange('contactName', e.target.value)}
              invalid={!!errors.contactName}
              message={errors.contactName}
              maxWidth="xl"
            />

            <TextInput
              label="Email Address"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              invalid={!!errors.email}
              message={errors.email}
              maxWidth="xl"
            />

            <TextInput
              label="Phone Number"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              invalid={!!errors.phone}
              message={errors.phone}
              maxWidth="xl"
            />

            <H2>Equipment Details</H2>

            <Select
              label="Equipment Type"
              placeholder="Select equipment type"
              required
              value={formData.equipmentType}
              onChange={(e) => handleChange('equipmentType', e.target.value)}
              invalid={!!errors.equipmentType}
              message={errors.equipmentType}
              options={[
                { label: 'Communication Equipment', value: 'communication' },
                { label: 'Computing Equipment', value: 'computing' },
                { label: 'Measurement & Testing Equipment', value: 'measurement' },
                { label: 'Medical Equipment', value: 'medical' },
                { label: 'Navigation Equipment', value: 'navigation' },
                { label: 'Surveillance Equipment', value: 'surveillance' },
                { label: 'Other', value: 'other' }
              ]}
              maxWidth="xl"
            />

            <Textarea
              label="Equipment Description"
              hint="Provide a detailed description of the equipment"
              required
              value={formData.equipmentDescription}
              onChange={(e) => handleChange('equipmentDescription', e.target.value)}
              invalid={!!errors.equipmentDescription}
              message={errors.equipmentDescription}
              maxWidth="xl"
            />

            <TextInput
              label="Manufacturer"
              required
              value={formData.manufacturer}
              onChange={(e) => handleChange('manufacturer', e.target.value)}
              invalid={!!errors.manufacturer}
              message={errors.manufacturer}
              maxWidth="xl"
            />

            <TextInput
              label="Model Number"
              required
              value={formData.modelNumber}
              onChange={(e) => handleChange('modelNumber', e.target.value)}
              invalid={!!errors.modelNumber}
              message={errors.modelNumber}
              maxWidth="xl"
            />

            <TextInput
              label="Serial Number"
              value={formData.serialNumber}
              onChange={(e) => handleChange('serialNumber', e.target.value)}
              maxWidth="xl"
            />

            <TextInput
              label="Quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => handleChange('quantity', e.target.value)}
              maxWidth="sm"
            />

            <H2>Export Information</H2>

            <Select
              label="Destination Country"
              placeholder="Select destination country"
              required
              value={formData.destinationCountry}
              onChange={(e) => handleChange('destinationCountry', e.target.value)}
              invalid={!!errors.destinationCountry}
              message={errors.destinationCountry}
              options={[
                { label: 'China', value: 'CN' },
                { label: 'India', value: 'IN' },
                { label: 'Indonesia', value: 'ID' },
                { label: 'Japan', value: 'JP' },
                { label: 'Malaysia', value: 'MY' },
                { label: 'New Zealand', value: 'NZ' },
                { label: 'Singapore', value: 'SG' },
                { label: 'South Korea', value: 'KR' },
                { label: 'Thailand', value: 'TH' },
                { label: 'United Kingdom', value: 'GB' },
                { label: 'United States', value: 'US' },
                { label: 'Vietnam', value: 'VN' }
              ]}
              maxWidth="xl"
            />

            <Textarea
              label="Intended Use"
              hint="Explain the intended use of the equipment"
              required
              value={formData.intendedUse}
              onChange={(e) => handleChange('intendedUse', e.target.value)}
              invalid={!!errors.intendedUse}
              message={errors.intendedUse}
              maxWidth="xl"
            />

            <TextInput
              label="Expected Export Date"
              type="date"
              required
              value={formData.exportDate}
              onChange={(e) => handleChange('exportDate', e.target.value)}
              invalid={!!errors.exportDate}
              message={errors.exportDate}
              maxWidth="xl"
            />

            <H2>Export Value</H2>

            <TextInput
              label="Export Value"
              type="number"
              hint="Enter the total value of goods being exported"
              value={formData.exportValue}
              onChange={(e) => {
                handleChange('exportValue', e.target.value)
                setConvertedAUD(null)
              }}
              maxWidth="xl"
            />

            <Select
              label="Currency"
              placeholder="Select currency"
              value={formData.exportCurrency}
              onChange={(e) => {
                handleChange('exportCurrency', e.target.value)
                setConvertedAUD(null)
              }}
              options={[
                { label: 'Australian Dollar (AUD)', value: 'AUD' },
                { label: 'US Dollar (USD)', value: 'USD' },
                { label: 'Euro (EUR)', value: 'EUR' },
                { label: 'British Pound (GBP)', value: 'GBP' },
                { label: 'Japanese Yen (JPY)', value: 'JPY' },
                { label: 'Chinese Yuan (CNY)', value: 'CNY' },
                { label: 'Indian Rupee (INR)', value: 'INR' },
                { label: 'Singapore Dollar (SGD)', value: 'SGD' },
                { label: 'New Zealand Dollar (NZD)', value: 'NZD' },
                { label: 'South Korean Won (KRW)', value: 'KRW' },
                { label: 'Thai Baht (THB)', value: 'THB' },
                { label: 'Malaysian Ringgit (MYR)', value: 'MYR' },
                { label: 'Indonesian Rupiah (IDR)', value: 'IDR' },
                { label: 'Vietnamese Dong (VND)', value: 'VND' }
              ]}
              maxWidth="xl"
            />

            {formData.exportValue && formData.exportCurrency && (
              <Box>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleConvertToAUD}
                >
                  Convert to AUD
                </Button>
              </Box>
            )}

            {convertedAUD && (
              <Card background="bodyAlt">
                <CardInner>
                  <Stack gap={1}>
                    <Text fontSize="sm" color="muted" fontWeight="bold">
                      Converted Value
                    </Text>
                    <Text fontSize="xl" fontWeight="bold">
                      {convertedAUD} AUD
                    </Text>
                    <Text fontSize="sm" color="muted">
                      Based on indicative exchange rates. Actual rates may vary.
                    </Text>
                  </Stack>
                </CardInner>
              </Card>
            )}

            <ButtonGroup>
              <Button type="submit">Submit Application</Button>
              <Button variant="secondary" type="button" onClick={handleReset}>
                Reset Form
              </Button>
            </ButtonGroup>
          </FormStack>
        </form>
      </Stack>
    </PageContent>
  )
}

export default App
