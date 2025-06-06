if (!fontsLoaded) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.buttonText}>Select Image</Text>
      </TouchableOpacity>
      {image && (
        <Image source={{ uri: image }} style={styles.imagePreview} />
      )}
      <TouchableOpacity
        style={styles.draftButton}
        onPress={() => setIsDraft(!isDraft)}
      >
        <Text style={styles.buttonText}>{isDraft ? 'Save as Published' : 'Save as Draft'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.submitButton, uploading && { opacity: 0.5 }]}
        onPress={handleSubmit}
        disabled={uploading}
      >
        <Text style={styles.buttonText}>{uploading ? 'Saving...' : (editingAnnouncement ? 'Update' : 'Submit')}</Text>
      </TouchableOpacity>
      {editingAnnouncement && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancelEdit}
        >
          <Text style={styles.buttonText}>Cancel Edit</Text>
        </TouchableOpacity>
      )}
      {announcements.length > 0 && (
        <View style={styles.announcementsList}>
          <Text style={styles.sectionTitle}>Recent Announcements</Text>
          {announcements.slice(0, 3).map((item) => (
            <View key={item.id} style={styles.announcementItem}>
              <View style={styles.announcementContent}>
                <Text style={styles.announcementTitle}>{item.title}</Text>
                <Text style={styles.announcementCategory}>{item.category}</Text>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={() => handleEdit(item)}>
                  <Image
                    source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/edit.png' }}
                    style={styles.actionIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Image
                    source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/trash.png' }}
                    style={styles.actionIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
      <View style={styles.bottomNav}>
        <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/home.png' }} style={styles.bottomIcon} />
        <TouchableOpacity onPress={() => navigation.navigate('AdminIcon')}>
          <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/user-male-circle.png' }} style={styles.bottomIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('AdminCalendar')}>
          <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/calendar.png' }} style={styles.bottomIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('AdminAnnouncements')}>
          <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/microphone.png' }} style={styles.bottomIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    paddingBottom: 60,
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: colors.red,
    marginBottom: 20,
  },
  input: {
    width: width * 0.9,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: colors.black,
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
  },
  imageButton: {
    backgroundColor: colors.gray,
    borderRadius: 10,
    padding: 15,
    width: width * 0.9,
    alignItems: 'center',
    marginVertical: 10,
  },
  imagePreview: {
    width: width * 0.9,
    height: 150,
    borderRadius: 10,
    marginVertical: 10,
  },
  draftButton: {
    backgroundColor: colors.gray,
    borderRadius: 10,
    padding: 15,
    width: width * 0.9,
    alignItems: 'center',
    marginVertical: 10,
  },
  submitButton: {
    backgroundColor: colors.red,
    borderRadius: 10,
    padding: 15,
    width: width * 0.9,
    alignItems: 'center',
    marginVertical: 10,
  },
  cancelButton: {
    backgroundColor: colors.gray,
    borderRadius: 10,
    padding: 15,
    width: width * 0.9,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: colors.yellow,
  },
  announcementsList: {
    width: width * 0.9,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: colors.red,
    marginBottom: 10,
  },
  announcementItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: colors.black,
    alignItems: 'center',
  },
  announcementContent: {
    flex: 1,
  },
  announcementTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: colors.black,
  },
  announcementCategory: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: colors.red,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionIcon: {
    width: 24,
    height: 24,
    marginLeft: 10,
    tintColor: colors.red,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignSelf: 'center',
  },
  bottomIcon: {
    width: 30,
    height: 30,
    tintColor: colors.red,
  },
});