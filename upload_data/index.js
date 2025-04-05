const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// Initialize Firebase Admin with service account key
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Get Firestore reference
const db = admin.firestore();

// Directory containing JSON files (the folder "json")
const jsonDirectory = path.join(__dirname, "json"); // The "json" folder in the current directory

// Function to upload all JSON files to Firestore
async function uploadJSONToFirestore() {
  try {
    // Read all files from the "json" directory
    const files = fs.readdirSync(jsonDirectory);

    // Iterate through each file in the directory
    for (const file of files) {
      // Process only JSON files
      if (file.endsWith(".json")) {
        const filePath = path.join(jsonDirectory, file);

        // Read the JSON data from the file
        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

        // Determine the collection name from the file name (without extension)
        const collectionName = path.basename(file, ".json");

        // Upload the JSON data to Firestore as a document in the collection
        const docRef = db.collection(collectionName).doc(); // auto-generate document ID
        await docRef.set(data);

        console.log(
          `Uploaded ${file} to Firestore collection ${collectionName}`
        );
      }
    }
  } catch (error) {
    console.error("Error uploading JSON files to Firestore:", error);
  }
}

// Call the function to upload JSON files
uploadJSONToFirestore();
