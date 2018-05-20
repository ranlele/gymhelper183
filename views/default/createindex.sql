CREATE INDEX LookUpPosts ON ChirpPosts(posterID,postDate);

EXPLAIN SELECT* FROM ChirpPosts WHERE posterID = 117;