import { Client, Databases, ID, Query } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client() // ACCESS TO APPWRITE FUNCTIONALITIES
  .setEndpoint("https://cloud.appwrite.io/v1") // POINTING TO APPWRITE SERVERS
  .setProject(PROJECT_ID);

const database = new Databases(client); // USING APPWRITE'S DATABASE FUNCTIONALITY

export const updateSearchCount = async (searchTerm, movie) => {
  /*
   * USE APPWRITE SDK TO CHECK IF SEARCH TERM EXISTS IN THE DATABASE
   * IF IT DOES, UPDATE THE COUNT
   * IF IT DOESN'T CREATE A NEW DOCUMENT WITH SEARCH TERM AND COUNT AS 1
   */

  try {
    const result = await database.listDocuments(
      DATABASE_ID, // IN WHICH DATABASE WE WANT TO LIST THE DOCUMENTS
      COLLECTION_ID, // IN WHICH COLLECTION WE WANT TO LIST THE DOCUMENTS
      [Query.equal("searchTerm", searchTerm)] // MATCHING WHAT WE HAVE AT THE DATABASE WITH WHAT USERS ARE SEARCH FOR
    );
    // IF DOCUMENT EXISTS
    if (result.documents.length > 0) {
      const doc = result.documents[0]; // GET THAT DOCUMENT
      // UPDATING THE COUNT
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1,
      });
    }
    // IF DOCUMENT DOESN'T EXIST
    else {
      // ID.unique() GENERATES A UNIQUE ID FOR THE NEW DOCUMENT
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
        movie_id: movie.id,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export const getTrendingMovies = async () => {
  try {
    const results = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5), // GET 5 DOCUMENTS
      Query.orderDesc("count"), // ORDER THEM BY COUNT IN DESCENDING ORDER
    ]);

    return results.documents;
  } catch (error) {
    console.error(error);
  }
};
