-- Creates one Mail draft per book, addressed to you, ready to forward.
-- Usage: osascript mkdrafts.applescript <dir-with-slug.html-and-.txt>
on run argv
	set dir to item 1 of argv
	set titles to {"Salary Booster", "Bug Sniper", "AI Arsenal"}
	set slugs to {"career-leverage", "real-engineering", "ai-working-engineer"}
	tell application "Mail"
		repeat with i from 1 to 3
			set slug to item i of slugs
			set titleText to item i of titles
			set plainText to read (POSIX file (dir & "/" & slug & ".txt")) as «class utf8»
			set htmlText to read (POSIX file (dir & "/" & slug & ".html")) as «class utf8»
			set m to make new outgoing message with properties {subject:"Your ebook: " & titleText, content:plainText, visible:false}
			tell m
				make new to recipient at end of to recipients with properties {address:"rohitbhandari.work@gmail.com"}
				try
					set html content of m to htmlText
				on error
				end try
			end tell
		end repeat
		return "created " & (count of outgoing messages) & " drafts"
	end tell
end run
