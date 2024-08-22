const extractReadingWeek = (events, semester) => {
  const getReadingWeeks = (semesterKeyword) => {
    const filteredEvents = events.filter((event) => {
      const isMatch = event.title.includes(`${semesterKeyword} Reading Week`);
      console.log(
        `Checking event title "${event.title}" for match with "${semesterKeyword} Reading Week": ${isMatch}`,
      );
      return isMatch;
    });

    const weeks = filteredEvents
      .map((event) => {
        const weekMatch = event.title.match(/\(Week (\d+)\)/);
        if (weekMatch) {
          console.log(
            `Found week number in title "${event.title}": Week ${weekMatch[1]}`,
          );
        } else {
          console.log(`No week number found in title "${event.title}"`);
        }
        return weekMatch ? parseInt(weekMatch[1], 10) : null;
      })
      .filter((week) => week !== null);

    console.log(`Extracted weeks for ${semesterKeyword}:`, weeks);

    return weeks;
  };

  if (semester === 'first') {
    const sem1Weeks = getReadingWeeks('Sem 1');
    console.log('Extracted Reading Weeks for Sem 1:', sem1Weeks);
    return sem1Weeks;
  } else if (semester === 'second') {
    const sem2Weeks = getReadingWeeks('Sem 2');
    console.log('Extracted Reading Weeks for Sem 2:', sem2Weeks);
    return sem2Weeks;
  } else if (semester === 'whole session') {
    const sem1Weeks = getReadingWeeks('Sem 1');
    const sem2Weeks = getReadingWeeks('Sem 2');
    const readingWeeks = { sem1: sem1Weeks, sem2: sem2Weeks };
    console.log('Extracted Reading Weeks for Whole Session:', readingWeeks);
    return readingWeeks;
  }
};

module.exports = { extractReadingWeek };
