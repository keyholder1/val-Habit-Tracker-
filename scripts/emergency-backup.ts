import { prisma } from '@/lib/db'
import * as fs from 'fs'
import * as path from 'path'

async function emergencyBackup() {
    console.log('🚨 [Emergency Backup] Starting full data export...')

    try {
        const [
            users,
            goals,
            weeklyLogs,
            migraineEntries,
            projectEntries,
            eventLogs
        ] = await Promise.all([
            prisma.user.findMany(),
            prisma.goal.findMany(),
            prisma.weeklyLog.findMany(),
            prisma.migraineEntry.findMany(),
            prisma.projectDiaryEntry.findMany({ include: { codeBlocks: true } }),
            prisma.eventLog.findMany({ take: 1000, orderBy: { createdAt: 'desc' } })
        ])

        const backupData = {
            exportedAt: new Date().toISOString(),
            stats: {
                users: users.length,
                goals: goals.length,
                weeklyLogs: weeklyLogs.length,
                migraineEntries: migraineEntries.length,
                projectEntries: projectEntries.length,
                eventLogs: eventLogs.length
            },
            data: {
                users,
                goals,
                weeklyLogs,
                migraineEntries,
                projectEntries,
                eventLogs
            }
        }

        const fileName = `emergency-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
        const filePath = path.join(process.cwd(), 'backups', fileName)

        if (!fs.existsSync(path.join(process.cwd(), 'backups'))) {
            fs.mkdirSync(path.join(process.cwd(), 'backups'))
        }

        fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2))

        console.log(`✅ [Emergency Backup] Export successful!`)
        console.log(`📍 Location: ${filePath}`)
        console.log(`📊 Summary: ${users.length} users, ${goals.length} goals, ${weeklyLogs.length} logs.`)

        return filePath
    } catch (error) {
        console.error('❌ [Emergency Backup] Export failed:', error)
        process.exit(1)
    }
}

emergencyBackup()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
