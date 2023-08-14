```mermaid
erDiagram

  "user" {
    Int user_id "🗝️"
    String avatar_file_id "❓"
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
  

  "post" {
    Int post_id "🗝️"
    Int toukousya_id 
    String book_id 
    String book_title 
    String post_title 
    String content 
    Boolean published 
    DateTime published_at "❓"
    Int hearts 
    DateTime created_at 
    DateTime updated_at 
    }
  
    "user" o|--|o "file" : "avatar_image"
    "user" o{--}o "session" : "session_list"
    "user" o{--}o "post" : "post_list"
    "session" o|--|o "user" : "user"
    "file" o{--}o "user" : "user_list"
    "post" o|--|| "user" : "toukousya"
```
