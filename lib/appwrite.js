import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';

export const config = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.ios.aora",
    projectId: "67bec458000c6f1d9eae",
    databaseId: "67bec6eb001b2087db51",
    userCollectionId: "67bec710003b0ff1f5f9",
    videoCollectionId: "67bec74300238576f75f",
    storageId: "67bec9e80032dbb00797",
}

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId,
} = config

const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform)

    const account = new Account(client);
    const avatars = new Avatars(client);
    const databases = new Databases(client)
    const storage = new Storage(client)

    export const createUser = async (email, password, username) => {
        try {
            const newAccount = await account.create(
                ID.unique(),
                email,
                password,
                username
            )
            if(!newAccount) throw Error;

            const avatarUrl = avatars.getInitials(username)

            await signIn(email, password)

            const newUser = await databases.createDocument(
                config.databaseId,
                config.userCollectionId,
                ID.unique(),
                {
                    accountId: newAccount.$id,
                    email,
                    username,
                    avatar: avatarUrl
                }
            )
            return newUser

        } catch (error) {
            console.log(error);
            throw new Error(error);
            
        }

    }
    
    export const signIn = async (email, password) => {
        try {
            const session = await account.createEmailPasswordSession(email, password)
            return session;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    export const signOut = async () => {
        try {
            const session = await account.deleteSession('current')
            return session;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    export const getCurrentUser = async () => {
        try {
            const currentAccount = await account.get()

            if (!currentAccount) throw Error

            const currentUser = await databases.listDocuments(
                config.databaseId,
                config.userCollectionId,
                [Query.equal('accountId', currentAccount.$id)]
            )

            if(!currentUser) throw Error
            return currentUser.documents[0]

        } catch (error) {
            console.log(error);
            return null
        }
    }

    export const getAllPosts = async () => {
        try {
            const posts = await databases.listDocuments(
                databaseId,
                videoCollectionId
            )
            return posts.documents
        } catch (error) {
            throw new Error(error)
        }
    }

    export const getLatestPosts = async () => {
        try {
            const posts = await databases.listDocuments(
                databaseId,
                videoCollectionId,
                [Query.orderDesc("$createdAt"), Query.limit(7)]
            )
            return posts.documents
        } catch (error) {
            throw new Error(error)
        }
    }

    export const searchPosts = async (query) => {
        try {
            const posts = await databases.listDocuments(
                databaseId,
                videoCollectionId,
                [Query.search('title', query)]
            )
            return posts.documents
        } catch (error) {
            throw new Error(error)
        }
    }

    export const userPosts = async (userId) => {
        try {
            const posts = await databases.listDocuments(
                databaseId,
                videoCollectionId,
                [Query.equal('creator', userId)]
            )
            return posts.documents
        } catch (error) {
            throw new Error(error)
        }
    }


    export const getFilePreview = async (fileId, type) => {
        let fileUrl

        try {
            if (type === 'video') {
                fileUrl = storage.getFileView(storageId, fileId)
            } else if  (type === 'image') {
                fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, 'top', 100)
            } else {
                throw new Error('Invalid file type')
            }

            if(!fileUrl) throw Error

            return fileUrl
        } catch (error) {
            throw new Error(error)
        }
     }

    export const uploadFile = async (file, type) => {
       if(!file) return;

       const fileName = file.fileName || `upload.${type === 'image' ? 'jpg' : 'mp4'}`; // Fallback na nazwę pliku
    const fileType = file.mimeType || (type === 'image' ? 'image/jpeg' : 'video/mp4'); // Fallback na typ MIME

    const asset = {
        name: fileName,
        type: fileType,
        uri: file.uri,
        size: file.fileSize || 0, // Jeśli brak rozmiaru, daj 0 (nie powinno się zdarzyć)
    };

       console.log(file);

       try {
            const uploadedFile = await storage.createFile(
                storageId,
                ID.unique(),
                asset
            );
            console.log(uploadedFile);
            const fileUrl = await getFilePreview(uploadedFile.$id, type)

            return fileUrl
       } catch (error) {
            throw new Error(error)
       }
    }

    export const createVideo = async (form) => {
        try {
            const [thumbnailUrl, videoUrl] = await Promise.all([
                uploadFile(form.thumbnail, 'image'),
                uploadFile(form.video, 'video'),
            ])

            const newPost = await databases.createDocument(
                databaseId, videoCollectionId, ID.unique(), {
                    title: form.title,
                    thumbnail: thumbnailUrl,
                    video: videoUrl,
                    prompt: form.prompt,
                    creator: form.userId,
                }
            )

            return newPost
        } catch (error) {
            throw new Error(error)
        }
    }

    export const toggleLike = async (postId, userId) => {
        try {
          const post = await databases.getDocument(databaseId, videoCollectionId, postId);
          const currentLikes = post.liked || [];
          const isLiked = currentLikes.includes(userId);
      
          const updatedLikes = isLiked 
            ? currentLikes.filter(id => id !== userId) 
            : [...currentLikes, userId];
      
          return await databases.updateDocument(
            databaseId,
            videoCollectionId,
            postId,
            { liked: updatedLikes }
          );
        } catch (error) {
          throw new Error(error);
        }
      };

    export const getLikedPosts = async (userId) => {
        if (!userId) return [];
        try {
          const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.contains('liked', userId)]
          );
          return posts.documents;
        } catch (error) {
          throw new Error(error);
        }
      };