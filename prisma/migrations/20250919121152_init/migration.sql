-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "googleId" TEXT,
    "avatar" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastLogin" DATETIME
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "company" TEXT,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "year" INTEGER NOT NULL DEFAULT 2024,
    "clientId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "projects_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "transcriptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "originalFileName" TEXT NOT NULL,
    "fileSize" TEXT NOT NULL,
    "fileDuration" INTEGER,
    "fileFormat" TEXT NOT NULL,
    "mimeType" TEXT,
    "language" TEXT NOT NULL DEFAULT 'pt-BR',
    "modelUsed" TEXT NOT NULL DEFAULT 'whisper-1',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "speakersCount" INTEGER,
    "confidence" REAL,
    "wordCount" INTEGER,
    "transcriptText" TEXT,
    "googleDriveFolder" TEXT,
    "docxFileId" TEXT,
    "pdfFileId" TEXT,
    "docxFileUrl" TEXT,
    "pdfFileUrl" TEXT,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "completedAt" DATETIME,
    CONSTRAINT "transcriptions_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "transcriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "speakers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transcriptionId" TEXT NOT NULL,
    "speakerLabel" TEXT NOT NULL,
    "customName" TEXT,
    "confidence" REAL,
    "totalDuration" INTEGER,
    "segmentsCount" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "speakers_transcriptionId_fkey" FOREIGN KEY ("transcriptionId") REFERENCES "transcriptions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "transcription_segments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transcriptionId" TEXT NOT NULL,
    "speakerId" TEXT NOT NULL,
    "startTime" REAL NOT NULL,
    "endTime" REAL NOT NULL,
    "duration" REAL NOT NULL,
    "text" TEXT NOT NULL,
    "confidence" REAL,
    "wordCount" INTEGER,
    "sequence" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "transcription_segments_transcriptionId_fkey" FOREIGN KEY ("transcriptionId") REFERENCES "transcriptions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "transcription_segments_speakerId_fkey" FOREIGN KEY ("speakerId") REFERENCES "speakers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "clients_name_key" ON "clients"("name");
