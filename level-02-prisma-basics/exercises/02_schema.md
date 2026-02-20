enum Role {
    USER
    ADMIN
    MODERATOR
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  role      Role(default(USER))
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
