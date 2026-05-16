'use server'

import prisma from '@/lib/prisma'
import { z } from 'zod'

const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Valid phone number required"),
  grade: z.string().min(1, "Grade selection required"),
})

export type LeadFormValues = z.infer<typeof leadSchema>

export async function submitLead(data: LeadFormValues) {
  try {
    const validated = leadSchema.parse(data)
    
    await prisma.lead.create({
      data: validated
    })

    return { success: true }
  } catch (error: any) {
    console.error("Lead submission error:", error)
    return { success: false, error: error.message || "Failed to submit application" }
  }
}
