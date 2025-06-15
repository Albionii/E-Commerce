import connectDB from "@/lib/mongodb"
import Contact, { type IContact } from "@/lib/models/Contact"
import mongoose from "mongoose"

export async function createContact(contactData: {
  name: string
  email: string
  subject: string
  message: string
}) {
  try {
    console.log("Creating contact message...")
    await connectDB()
    const contact = new Contact(contactData)
    await contact.save()
    console.log("Contact message created successfully:", contact._id)
    return contact
  } catch (error) {
    console.error("Error creating contact message:", error)
    throw error
  }
}

export async function getContactById(id: string): Promise<IContact | null> {
  try {
    console.log("Fetching contact by ID:", id)
    await connectDB()

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ObjectId format:", id)
      return null
    }

    const contact = await Contact.findById(id).lean()
    console.log("Contact fetched:", !!contact)
    return contact
  } catch (error) {
    console.error("Error fetching contact:", error)
    throw error
  }
}

export async function getAllContacts(
  filters: {
    page?: number
    limit?: number
    status?: string
  } = {},
) {
  try {
    console.log("Fetching all contacts with filters:", filters)
    await connectDB()

    const { page = 1, limit = 10, status } = filters
    const skip = (page - 1) * limit

    // Build query
    const query: any = {}
    if (status) {
      query.status = status
    }

    console.log("Database query:", query)

    const [contacts, total] = await Promise.all([
      Contact.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      Contact.countDocuments(query),
    ])

    console.log("Contacts query result:", {
      contactsCount: contacts.length,
      total,
      pages: Math.ceil(total / limit),
    })

    return {
      contacts,
      total,
      page,
      pages: Math.ceil(total / limit),
    }
  } catch (error) {
    console.error("Error fetching contacts:", error)
    throw error
  }
}

export async function updateContactStatus(id: string, status: IContact["status"]) {
  try {
    console.log("Updating contact status:", id, "to", status)
    await connectDB()

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ObjectId format:", id)
      return null
    }

    const contact = await Contact.findByIdAndUpdate(id, { status }, { new: true })
    console.log("Contact status updated successfully:", !!contact)
    return contact
  } catch (error) {
    console.error("Error updating contact status:", error)
    throw error
  }
}

export async function deleteContact(id: string) {
  try {
    console.log("Deleting contact:", id)
    await connectDB()

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ObjectId format:", id)
      return null
    }

    const contact = await Contact.findByIdAndDelete(id)
    console.log("Contact deleted successfully:", !!contact)
    return contact
  } catch (error) {
    console.error("Error deleting contact:", error)
    throw error
  }
}

export async function getContactStats() {
  try {
    console.log("Fetching contact stats...")
    await connectDB()

    const [totalContacts, statusCounts] = await Promise.all([
      Contact.countDocuments(),
      Contact.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    ])

    console.log("Contact stats:", { totalContacts, statusCounts })

    const stats = {
      totalContacts,
      statusCounts: statusCounts.reduce((acc, item) => {
        acc[item._id] = item.count
        return acc
      }, {}),
    }

    return stats
  } catch (error) {
    console.error("Error fetching contact stats:", error)
    throw error
  }
}
