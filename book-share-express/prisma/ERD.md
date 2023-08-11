```mermaid
erDiagram

  "user" {
    Int user_id "🗝️"
    String email 
    String username 
    DateTime created_at 
    Int created_by 
    DateTime updated_at 
    Int updated_by 
    }
  

  "session" {
    Int session_id "🗝️"
    String session_key 
    Int originalMaxAge "❓"
    Int maxAge "❓"
    Boolean signed "❓"
    DateTime expires "❓"
    Boolean httpOnly "❓"
    String path 
    String domain 
    Boolean secure "❓"
    Boolean sameSite "❓"
    Int user_id "❓"
    DateTime created_at 
    DateTime updated_at 
    }
  

  "file" {
    String file_id "🗝️"
    String originalname 
    String mimetype 
    Int size 
    DateTime created_at 
    Int created_by 
    DateTime updated_at 
    Int updated_by 
    }
  
    "user" o{--}o "session" : "session_list"
    "session" o|--|o "user" : "user"
```
