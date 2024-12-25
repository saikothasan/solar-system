'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Check, CreditCard, Info, HelpCircle } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { toast } from "@/hooks/use-toast"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function Home() {
  const [bins, setBins] = useState('')
  const [cvv, setCvv] = useState('')
  const [quantity, setQuantity] = useState('10')
  const [month, setMonth] = useState('random')
  const [year, setYear] = useState('random')
  const [generatedCards, setGeneratedCards] = useState('')

  // Luhn algorithm implementation
  function luhnCheck(num: string): boolean {
    let arr = (num + '')
      .split('')
      .reverse()
      .map(x => parseInt(x));
    let sum = arr.reduce((acc, val, i) => 
      (i % 2 !== 0 ? acc + val : acc + ((val * 2) % 9) || 9), 0);
    return sum % 10 === 0;
  }

  function generateLuhn(partial: string): string {
    for(let i = 0; i < 10; i++) {
      let candidate = partial + i;
      if(luhnCheck(candidate)) return candidate;
    }
    return partial + '0'; // Fallback
  }

  function generateRandomNumber(length: number): string {
    let result = ''
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10)
    }
    return result
  }

  function generateDate(): string {
    const currentYear = new Date().getFullYear()
    const randomMonth = Math.floor(Math.random() * 12) + 1
    const randomYear = currentYear + Math.floor(Math.random() * 6)
    
    const monthToUse = month === 'random' ? randomMonth : parseInt(month)
    const yearToUse = year === 'random' ? randomYear : parseInt(year)
    
    return `${monthToUse.toString().padStart(2, '0')}|${yearToUse.toString().slice(-2)}`
  }

  function isAmex(bin: string): boolean {
    return bin.startsWith('34') || bin.startsWith('37');
  }

  function generateCVV(bin: string): string {
    if (cvv) {
      if (isAmex(bin) && cvv.length === 4) return cvv;
      if (!isAmex(bin) && cvv.length === 3) return cvv;
    }
    return generateRandomNumber(isAmex(bin) ? 4 : 3)
  }

  function validateBin(bin: string): boolean {
    return /^\d{6,8}$/.test(bin.trim());
  }

  function generateValidCardNumber(bin: string): string {
    const isAmexCard = isAmex(bin);
    const length = isAmexCard ? 15 : 16;
    const remainingLength = length - bin.length;
    let cardNumber;
    do {
      cardNumber = generateLuhn(bin + generateRandomNumber(remainingLength - 1));
    } while (!luhnCheck(cardNumber));
    return cardNumber;
  }

  function generateCards() {
    if (!bins.trim()) {
      toast({
        title: "Error",
        description: "Please enter at least one BIN",
        variant: "destructive"
      })
      return
    }

    const binList = bins.split(';').filter(bin => bin.trim())
    
    // Validate all BINs
    const invalidBins = binList.filter(bin => !validateBin(bin.trim()))
    if (invalidBins.length > 0) {
      toast({
        title: "Error",
        description: "Invalid BIN format. BINs must be 6-8 digits",
        variant: "destructive"
      })
      return
    }

    const cards: string[] = []
    const qty = parseInt(quantity)

    for (let i = 0; i < qty; i++) {
      const selectedBin = binList[Math.floor(Math.random() * binList.length)].trim()
      const cardNumber = generateValidCardNumber(selectedBin);
      const date = generateDate()
      const cardCVV = generateCVV(selectedBin)

      cards.push(`${cardNumber}|${date}|${cardCVV}`)
    }

    setGeneratedCards(cards.join('\n'))
    toast({
      title: "Success",
      description: `Generated ${qty} valid cards`
    })
  }

  async function copyCards() {
    if (!generatedCards) {
      toast({
        title: "Error",
        description: "No cards to copy",
        variant: "destructive"
      })
      return
    }

    try {
      await navigator.clipboard.writeText(generatedCards)
      toast({
        title: "Success",
        description: "Cards copied to clipboard"
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy cards",
        variant: "destructive"
      })
    }
  }

  const features = [
    "Multiple BIN support with semicolon separation",
    "Luhn algorithm validation",
    "Custom or random expiry dates",
    "Custom or random CVV (3 digits for regular cards, 4 for AMEX)",
    "AMEX card support (15 digits, 4-digit CVV)",
    "Bulk generation capability",
    "Copy to clipboard functionality",
    "Input validation and error handling",
    "Responsive design",
    "Dark mode interface",
    "Real-time feedback"
  ]

  const faqs = [
    {
      question: "What is a BIN number?",
      answer: "A Bank Identification Number (BIN) is the first 6 to 8 digits of a credit card number that identify the card issuer and card type."
    },
    {
      question: "How do I use multiple BINs?",
      answer: "Enter multiple BINs separated by semicolons (;) in the BIN input field. For example: 123456;234567;345678"
    },
    {
      question: "Are the generated card numbers real?",
      answer: "No, the generated numbers are not real credit card numbers. They are valid according to the Luhn algorithm but are for testing purposes only."
    },
    {
      question: "What is the Luhn algorithm?",
      answer: "The Luhn algorithm is a checksum formula used to validate various identification numbers, including credit card numbers. It helps detect accidental errors in the number."
    },
    {
      question: "What is the maximum quantity I can generate?",
      answer: "You can generate up to 100 card numbers at once to ensure optimal performance."
    },
    {
      question: "Does this tool support American Express (AMEX) cards?",
      answer: "Yes, the tool supports AMEX cards. It will generate 15-digit card numbers with 4-digit CVVs for BINs starting with 34 or 37."
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-6xl mx-auto p-4 py-8 space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            MULTI BIN CC GENERATOR
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Generate valid test credit card numbers using multiple BINs. 
            Supports regular and AMEX cards. For educational and testing purposes only.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <section className="space-y-8">
            <Card className="bg-gray-800 border-gray-700 shadow-lg">
              <CardContent className="space-y-6 p-6">
                <div>
                  <Label htmlFor="bins" className="text-green-400 flex items-center">
                    Bins
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 ml-2" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter BINs separated by semicolons (;)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="bins"
                    placeholder="Enter Your Bins XXXXXX;XXXXXX;XXXXXX"
                    value={bins}
                    onChange={(e) => setBins(e.target.value)}
                    className="bg-gray-700 border-gray-600 focus:border-green-500 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">* Use 34 or 37 for AMEX</p>
                </div>

                <div>
                  <Label className="text-green-400">Date</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Select value={month} onValueChange={setMonth}>
                      <SelectTrigger className="bg-gray-700 border-gray-600">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="random">Random</SelectItem>
                        {Array.from({length: 12}, (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {(i + 1).toString().padStart(2, '0')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={year} onValueChange={setYear}>
                      <SelectTrigger className="bg-gray-700 border-gray-600">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="random">Random</SelectItem>
                        {Array.from({length: 6}, (_, i) => {
                          const year = new Date().getFullYear() + i
                          return (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="cvv" className="text-green-400 flex items-center">
                    CVV
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 ml-2" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>3 digits for regular cards, 4 for AMEX</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="cvv"
                    placeholder="XXX or XXXX for AMEX"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.slice(0, 4))}
                    className="bg-gray-700 border-gray-600 focus:border-green-500 focus:ring-green-500"
                    maxLength={4}
                  />
                </div>

                <div>
                  <Label htmlFor="quantity" className="text-green-400">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="bg-gray-700 border-gray-600 focus:border-green-500 focus:ring-green-500"
                    min="1"
                    max="100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    onClick={generateCards}
                    className="w-full bg-green-500 hover:bg-green-600 text-black font-bold"
                  >
                    Generate
                  </Button>
                  <Button 
                    onClick={copyCards}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-black font-bold"
                  >
                    Copy Cards
                  </Button>
                </div>

                <Textarea
                  value={generatedCards}
                  readOnly
                  className="h-[200px] bg-gray-700 border-gray-600 font-mono text-green-400"
                  placeholder="Generated cards will appear here..."
                />
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-2xl font-bold text-green-400 flex items-center">
                  <Info className="w-6 h-6 mr-2" />
                  About
                </h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    The Multi BIN CC Generator is an advanced tool designed for educational and testing purposes.
                    It generates valid credit card numbers using the Luhn algorithm and supports multiple BIN ranges,
                    including American Express cards.
                  </p>
                  <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                    <p className="text-yellow-400 font-semibold flex items-center">
                      <HelpCircle className="w-5 h-5 mr-2" />
                      Important Notice:
                    </p>
                    <p className="mt-2">
                      This tool is for educational and testing purposes only. Any use of generated numbers
                      for fraudulent activities is strictly prohibited and illegal.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-8">
            <Card className="bg-gray-800 border-gray-700 shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-green-400 mb-6 flex items-center">
                  <CreditCard className="w-6 h-6 mr-2" />
                  Features
                </h2>
                <div className="grid gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-gray-700 p-3 rounded-lg">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-green-400 mb-6 flex items-center">
                  <HelpCircle className="w-6 h-6 mr-2" />
                  FAQ
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border-gray-700">
                      <AccordionTrigger className="text-gray-300 hover:text-green-400">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-400">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </section>
        </div>

        <footer className="text-center text-sm text-gray-400 pt-8 border-t border-gray-800">
          <p>© {new Date().getFullYear()} Multi BIN CC Generator. For educational purposes only.</p>
        </footer>
      </div>
    </main>
  )
}

